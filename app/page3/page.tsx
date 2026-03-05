"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TypingText from "../components/TypingText";

export default function Page3() {
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const showFinalReport = setTimeout(() => setShowReport(true), 1000);
    return () => clearTimeout(showFinalReport);
  }, []);

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* Detective GIF */}
      <div className="absolute left-[25rem] bottom-[4rem] z-10">
        <img
          src="/videos/last-unscreen.gif"
          alt="Detective"
          className="w-[500px] h-auto"
        />
      </div>

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
            ✔ Case ID: 042<br />
            ✔ Suspects: 3 Identified<br />
            ✔ Evidence Collected: 7 Items<br />
            ✔ Status: Under Investigation<br />
            ✔ Notes: “Awaiting lab results.”
          </p>
        </motion.div>
      )}
    </div>
  );
}

