import os
import json
import cv2
import torch
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify
from collections import OrderedDict
from sentence_transformers import SentenceTransformer, util
from torchvision import transforms
from transformers import CLIPProcessor, CLIPModel, pipeline
from huggingface_hub import hf_hub_download, login
from flask_cors import CORS
from dotenv import load_dotenv  # ✅ NEW

# --- LOAD ENV VARIABLES ---
load_dotenv()  # ✅ Load from .env

HF_TOKEN = os.getenv("HF_TOKEN")
HF_REPO = os.getenv("HF_REPO")
CAPTIONS_PATH = r"C:/Crime Scene Solver/Backend/captions.json"
UPLOAD_PATH = r"C:/Crime Scene Solver/crime_scene_detection_frontend/public/uploads"

# --- INIT FLASK ---
app = Flask(__name__)
CORS(app)

# --- AUTH ---
login(token=HF_TOKEN)

# --- DOWNLOAD MODEL ---
model_path = hf_hub_download(repo_id=HF_REPO, filename="best_clip_model.pt", repo_type="model")

class CLIPWithDropout(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.clip = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        self.dropout = torch.nn.Dropout(0.2)

    def forward(self, **kwargs):
        outputs = self.clip(**kwargs)
        logits = self.dropout(outputs.logits_per_image)
        return logits

# Load model
base_model = CLIPWithDropout()
state_dict = torch.load(model_path, map_location="cpu")
base_model.load_state_dict(state_dict)
base_model.eval()
device = "cuda" if torch.cuda.is_available() else "cpu"
base_model.to(device)

clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
sbert_model = SentenceTransformer("all-MiniLM-L6-v2")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn", device=0 if torch.cuda.is_available() else -1)

# Load captions
with open(CAPTIONS_PATH, "r") as f:
    captions_dict = json.load(f)
captions_list = list(captions_dict.values())

# Precompute text embeddings
with torch.no_grad():
    text_inputs = clip_processor(text=captions_list, return_tensors="pt", padding=True, truncation=True).to(device)
    text_features = base_model.clip.get_text_features(**text_inputs)
    text_features = text_features / text_features.norm(dim=-1, keepdim=True)

def preprocess_frame(frame_bgr):
    frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    return Image.fromarray(frame_rgb)

def extract_even_frames(video_path, num_frames=32):
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    frame_indices = np.linspace(0, total_frames - 1, num=num_frames, dtype=int)
    frames = []
    for idx in range(total_frames):
        ret, frame = cap.read()
        if not ret:
            break
        if idx in frame_indices:
            frames.append(preprocess_frame(frame))
    cap.release()
    return frames

def get_top_k_captions(pil_img, text_features, all_captions, k=3):
    inputs = clip_processor(images=pil_img, return_tensors="pt").to(device)
    with torch.no_grad():
        image_features = base_model.clip.get_image_features(**inputs)
        image_features = image_features / image_features.norm(dim=-1, keepdim=True)
    similarity = (image_features @ text_features.T).squeeze(0)
    topk_indices = similarity.topk(k).indices.cpu().tolist()
    return [all_captions[i] for i in topk_indices]

def deduplicate_captions(captions, threshold=0.85):
    embeddings = sbert_model.encode(captions, convert_to_tensor=True)
    unique = []
    for i, emb in enumerate(embeddings):
        if any(util.cos_sim(emb, e).item() > threshold for e in embeddings[:i]):
            continue
        unique.append(captions[i])
    return unique

def summarize_video(video_path):
    print("🔍 Extracting frames...")
    frames = extract_even_frames(video_path)

    print("🎯 Selecting top captions per frame...")
    all_selected_captions = []
    for frame in frames:
        top_captions = get_top_k_captions(frame, text_features, captions_list, k=3)
        all_selected_captions.extend(top_captions)

    print("🧹 Deduplicating captions...")
    deduped = deduplicate_captions(all_selected_captions)

    prompt = (
        "You are a seasoned crime detective. Based on the visual descriptions below, "
        "write a professional incident summary focusing on suspicious behavior, illegal activity, "
        "and evidence of crime. Be factual and precise.\n\nDescriptions:\n"
    )
    combined_text = prompt + " ".join(deduped)
    summary = summarizer(combined_text, max_length=300, min_length=100, do_sample=False)[0]["summary_text"]

    # 🔎 Predict type of crime
    classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
    labels = ["robbery", "shoplifting", "explosion", "fighting", "no crime"]
    result = classifier(summary, candidate_labels=labels)
    crime_type = result["labels"][0]

    return summary, crime_type

@app.route("/upload", methods=["POST"])
def upload():
    data = request.get_json()
    filename = data.get("filename")

    if not filename:
        return jsonify({"error": "Filename not provided"}), 400

    filepath = os.path.join(UPLOAD_PATH, filename)

    if not os.path.exists(filepath):
        return jsonify({"error": "File not found"}), 404

    print(f"📁 Processing video: {filepath}")
    summary, crime_type = summarize_video(filepath)
    return jsonify({"summary": summary, "crime_type": crime_type})

if __name__ == "__main__":
    import asyncio
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    app.run(debug=True, port=5000)
