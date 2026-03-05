
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Page3() {
  const [showReport, setShowReport] = useState(false);
  const [showStaticImage, setShowStaticImage] = useState(false);
  const [staticImageLoaded, setStaticImageLoaded] = useState(false);

  // Show report after 1 second
  useEffect(() => {
    const showFinalReport = setTimeout(() => setShowReport(true), 1000);
    return () => clearTimeout(showFinalReport);
  }, []);

  // Load the static image and replace the gif after 1s delay
  useEffect(() => {
    const img = new Image();
    img.src = "/last-still.png";
    img.onload = () => {
      setStaticImageLoaded(true);
      setTimeout(() => setShowStaticImage(true), 1000); // delay switch after 1s
    };
  }, []);

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* GIF (hidden once static image is ready and replaced) */}
      {!showStaticImage && (
        <img
          src="/videos/last-unscreen.gif"
          alt="Detective GIF"
          className="absolute left-[25rem] bottom-[4rem] z-10 w-[500px] h-auto"
        />
      )}

      {/* Static image appears only after it's fully loaded */}
      {staticImageLoaded && showStaticImage && (
        <motion.img
          src="/last-still.png"
          alt="Detective (static)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute left-[calc(25rem-2rem)] bottom-[calc(4rem-2rem)] z-10 w-[18rem] h-auto"
        />
      )}

      {/* Final Report Appears and Grows from Top-Left */}
      {showReport && (
        <motion.div
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ transformOrigin: "left top" }}
          className="absolute left-[44rem] top-[15rem] w-[600px] h-[400px] bg-white rounded-xl shadow-xl p-6 text-black z-30"
        >
          <h2 className="text-2xl font-bold mb-4">Detective's Report</h2>
          <p>
            ✔ Case ID: 042
            <br />
            ✔ Suspects: 3 Identified
            <br />
            ✔ Evidence Collected: 7 Items
            <br />
            ✔ Status: Under Investigation
            <br />
            ✔ Notes: “Awaiting lab results.”
          </p>
        </motion.div>
      )}
    </div>
  );
}
