"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

export default function Page2() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [frames, setFrames] = useState<string[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [showBox, setShowBox] = useState(false);
  const [startMorph, setStartMorph] = useState(false);
  const controls = useAnimation();

  const FRAME_WIDTH = 600;
  const FRAME_HEIGHT = 400;

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoFile(file);
    setFrames([]);
    setCurrentFrame(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
    } catch (err) {
      console.error("Upload failed", err);
    }

    // Start transition AFTER file is selected
    await controls.start({
      x: 150,
      transition: { duration: 1, ease: "easeInOut" },
    });

    setTimeout(() => {
      setStartMorph(true);
      setShowBox(true);
    }, 400); // Let morph happen after move
  };

  useEffect(() => {
    if (!videoFile) return;
    let isCancelled = false;

    const video = document.createElement("video");
    video.src = URL.createObjectURL(videoFile);
    video.crossOrigin = "anonymous";
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const totalFramesToExtract = 20;

    const seekVideo = (time: number) =>
      new Promise<void>((resolve) => {
        let done = false;
        const onSeeked = () => {
          if (done) return;
          done = true;
          clearTimeout(timeoutId);
          video.removeEventListener("seeked", onSeeked);
          resolve();
        };
        video.addEventListener("seeked", onSeeked);
        video.currentTime = time;

        const timeoutId = setTimeout(() => {
          if (done) return;
          done = true;
          video.removeEventListener("seeked", onSeeked);
          resolve();
        }, 1500);
      });

    const extractAndDisplayFrames = async () => {
      await new Promise((r) => video.addEventListener("loadedmetadata", r));
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const newFrames: string[] = [];

      for (let i = 0; i < totalFramesToExtract; i++) {
        if (isCancelled) break;

        const time = (video.duration / totalFramesToExtract) * i;
        await seekVideo(time);

        if (isCancelled) break;

        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frameData = canvas.toDataURL("image/jpeg");
        newFrames.push(frameData);
        setFrames([...newFrames]);
        setCurrentFrame(newFrames.length - 1);
      }

      URL.revokeObjectURL(video.src);
    };

    extractAndDisplayFrames();

    return () => {
      isCancelled = true;
      URL.revokeObjectURL(video.src);
    };
  }, [videoFile]);

  useEffect(() => {
    if (frames.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [frames]);

  return (
    <div className="flex items-center justify-center h-screen w-full bg-black relative">
      {/* Detective */}
      <div className="fixed left-[25rem] bottom-[4rem] z-10">
        <img src="/videos/middle.gif" alt="Detective walking" />
      </div>

      {/* Fingerprint → Player Transition */}
      <motion.div
        animate={controls}
        initial={{ borderRadius: 999, x: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 16 }}
        className="absolute left-[45rem] top-1/2 -translate-y-1/2 z-20 flex items-center justify-center"
        onClick={handleButtonClick}
      >
        <motion.div
          layout
          animate={{
            width: startMorph ? FRAME_WIDTH : 80,
            height: startMorph ? FRAME_HEIGHT : 80,
            borderRadius: startMorph ? 20 : 999,
            backgroundColor: "#1f2937",
          }}
          transition={{ type: "spring", stiffness: 100, damping: 16 }}
          className="overflow-hidden shadow-lg border border-gray-700 relative flex items-center justify-center"
        >
          {!showBox ? (
            <div className="flex items-center justify-center w-full h-full">
              <Image
                src="/Fingerprint_round.png"
                alt="Fingerprint"
                width={82}
                height={82}
                className="cursor-pointer"
              />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.img
                key={currentFrame}
                src={frames[currentFrame]}
                alt={`frame-${currentFrame}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full object-contain absolute"
              />
            </AnimatePresence>
          )}
        </motion.div>
      </motion.div>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="video/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button className="fixed bottom-30 right-140 bg-gray-500 text-white px-4 py-2 rounded">
        <a href="/page3">Next</a>
      </button>
    </div>
  );
}
