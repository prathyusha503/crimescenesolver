// "use client";

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";

// export default function Page3() {
//   const [summary, setSummary] = useState("");
//   const [crimeType, setCrimeType] = useState("");
//   const [showReport, setShowReport] = useState(false);
//   const [showStaticImage, setShowStaticImage] = useState(false);
//   const [staticImageLoaded, setStaticImageLoaded] = useState(false);

//   useEffect(() => {
//     const fetchSummary = async () => {
//       const filename = localStorage.getItem("latestUploadedVideo") || "Crime_Scene.mp4";
//       try {
//         const res = await fetch("http://localhost:5000/upload", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ filename }),
//         });
//         const data = await res.json();
//         setSummary(data.summary || "Summary not available.");
//         setCrimeType(data.crime_type || "Unknown");
//       } catch (err) {
//         console.error("Failed to fetch report:", err);
//         setSummary("Error fetching summary.");
//         setCrimeType("Unknown");
//       }
//     };

//     fetchSummary();
//     const showFinalReport = setTimeout(() => setShowReport(true), 1000);
//     return () => clearTimeout(showFinalReport);
//   }, []);

//   useEffect(() => {
//     const img = new Image();
//     img.src = "/last-still.png";
//     img.onload = () => {
//       setStaticImageLoaded(true);
//       setTimeout(() => setShowStaticImage(true), 1000);
//     };
//   }, []);

//   const downloadReport = () => {
//   const reportText = `🕵️ Detective Report\n--------------------------\n✔ Type of Crime: ${crimeType}\n\n📄 Summary:\n${summary}`;
//   const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
//   const link = document.createElement("a");
//   link.href = URL.createObjectURL(blob);
//   link.download = "Detective_Report.txt";
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };


//   return (
//     <div className="relative h-screen bg-black overflow-hidden">
//       {!showStaticImage && (
//         <img
//           src="/videos/last-unscreen.gif"
//           alt="Detective GIF"
//           className="absolute left-[25rem] bottom-[4rem] z-10 w-[500px] h-auto"
//         />
//       )}

//       {staticImageLoaded && showStaticImage && (
//         <motion.img
//           src="/last-still.png"
//           alt="Detective (static)"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.6 }}
//           className="absolute left-[calc(25rem-2rem)] bottom-[calc(4rem-2rem)] z-10 w-[18rem] h-auto"
//         />
//       )}

//       {showReport && (
//         <>
//           {/* Report Box */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.2 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.8, ease: "easeOut" }}
//             style={{ transformOrigin: "left top" }}
//             className="absolute left-[44rem] top-[10rem] w-[600px] h-[400px] bg-white rounded-xl shadow-xl p-6 text-black z-30 overflow-y-auto"
//           >
//             <h2 className="text-2xl font-bold mb-4">Detective's Report</h2>
//             <p style={{ whiteSpace: "pre-wrap" }}>{summary}</p>
//             <p className="mt-6 font-semibold text-green-800">✔ Type of crime: {crimeType}</p>
//           </motion.div>

//           {/* Buttons outside the box */}
//           <div className="absolute left-[44rem] top-[45rem] flex gap-4 z-40">
//             <button
//               onClick={downloadReport}
//               className="px-4 py-2 bg-black text-white rounded-lg bg-gray-800 transition"
//             >
//               Download Report
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }







'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Page3() {
  const [summary, setSummary] = useState("");
  const [crimeType, setCrimeType] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [showStaticImage, setShowStaticImage] = useState(false);
  const [staticImageLoaded, setStaticImageLoaded] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      const filename = localStorage.getItem("latestUploadedVideo") || "Crime_Scene.mp4";

      try {
        const res = await fetch("http://localhost:5000/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filename }),
        });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();
        setSummary(data.summary || "Summary not available.");
        setCrimeType(data.crime_type || "Unknown");

      } catch (err) {
        console.error("❌ Failed to fetch report:", err);
        setSummary("Error fetching summary.");
        setCrimeType("Unknown");
      }
    };

    fetchSummary();

    const showFinalReport = setTimeout(() => setShowReport(true), 1000);
    return () => clearTimeout(showFinalReport);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = "/last-still.png";
    img.onload = () => {
      setStaticImageLoaded(true);
      setTimeout(() => setShowStaticImage(true), 1000);
    };
  }, []);

  const downloadReport = () => {
    const reportText = `🕵️ Detective Report\n--------------------------\n✔ Type of Crime: ${crimeType}\n\n📄 Summary:\n${summary}`;
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Detective_Report.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative h-screen bg-black overflow-hidden text-white">
      {/* Detective GIF → Static */}
      {!showStaticImage && (
        <img
          src="/videos/last-unscreen.gif"
          alt="Detective"
          className="absolute left-[20rem] bottom-[4rem] z-10 w-[500px]"
        />
      )}

      {staticImageLoaded && showStaticImage && (
        <motion.img
          src="/last-still.png"
          alt="Detective (static)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute left-[23rem] bottom-[2rem] z-10 w-[18rem]"
        />
      )}

      {/* Report Box */}
      {showReport && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ transformOrigin: "left top" }}
            className="absolute left-[44rem] top-[10rem] w-[600px] h-[400px] bg-white rounded-xl shadow-xl p-6 text-black z-30 overflow-y-auto"
          >
            <h2 className="text-2xl font-bold mb-4">Detective's Report</h2>
            <p className="whitespace-pre-wrap">{summary}</p>
            <p className="mt-6 font-semibold text-green-800">✔ Type of crime: {crimeType}</p>
          </motion.div>

          {/* Download Button */}
          <div className="absolute left-[44rem] top-[45rem] z-40">
            <button
              onClick={downloadReport}
              className="bg-gray-600 text-white px-5 py-4 rounded-xl hover:bg-gray-600 transitio"
            >
              Download Report
            </button>
          </div>
        </>
      )}
    </div>
  );
}
