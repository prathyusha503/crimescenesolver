import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";

// Ensure Node.js runtime (not Edge)
export const runtime = "nodejs";

// MongoDB config
const uri = process.env.MONGODB_URI as string;
const dbName = "crimeSceneDB";
const collectionName = "reports";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) throw new Error("No file uploaded");

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to /public/uploads folder
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, file.name);
    fs.writeFileSync(filePath, buffer);

    // Save metadata in MongoDB
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const reportData = {
      filename: file.name,
      uploadedAt: new Date(),
      size: file.size,
      type: file.type,
    };

    const result = await collection.insertOne(reportData);
    await client.close();

    return NextResponse.json({
      message: "Upload and DB save successful",
      file: file.name,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}