'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ReportGroup {
  text?: any;
  video?: any;
}

export default function Page4() {
  const [reportGroups, setReportGroups] = useState<ReportGroup[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const isAdmin = JSON.parse(localStorage.getItem('isAdmin') || 'false');
    if (!isAdmin) {
      router.push('/page1');
    } else {
      setCheckingAdmin(false);
    }
  }, []);

  useEffect(() => {
    if (checkingAdmin) return;
    const fetchReports = async () => {
      const res = await fetch('/api/getAllReports');
      const data = await res.json();
      if (Array.isArray(data)) setReportGroups(data);
    };
    fetchReports();
  }, [checkingAdmin]);

  useEffect(() => {
    const loadText = async () => {
      const current = reportGroups[currentIndex]?.text;
      if (current?.filename) {
        const res = await fetch(`/uploads/${current.filename}`);
        const text = await res.text();
        setTextContent(text);
      } else {
        setTextContent(null);
      }
    };
    if (reportGroups.length > 0) loadText();
  }, [currentIndex, reportGroups]);

  const handleNext = () => currentIndex < reportGroups.length - 1 && setCurrentIndex(currentIndex + 1);
  const handlePrevious = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1);

  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Checking access...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white p-6 flex flex-col items-center space-y-6">
      {/* Add Admin Button */}
      <div className="w-full flex justify-end">
        <button
          onClick={() => router.push('/?asAdmin=true')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-lg mb-4"
        >
          Add New Admin
        </button>
      </div>

      <h1 className="text-2xl font-bold text-center">Downloaded Summary and Video</h1>

      {reportGroups.length > 0 ? (
        <>
          <div className="flex flex-wrap gap-6 justify-center">
            {textContent && (
              <div className="bg-white text-black p-4 rounded-md shadow-md w-[320px] h-[260px] overflow-auto">
                <h2 className="text-lg font-semibold mb-2">Summary</h2>
                <pre className="whitespace-pre-wrap text-sm font-mono">{textContent}</pre>
              </div>
            )}
            {reportGroups[currentIndex]?.video && (
              <div className="bg-gray-900 rounded-md shadow-md w-[320px] h-[260px] flex items-center justify-center overflow-hidden">
                <video controls className="w-full h-full object-cover rounded">
                  <source src={`/uploads/${reportGroups[currentIndex].video.filename}`} type="video/mp4" />
                </video>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-6 justify-center mt-4 text-xs">
            {reportGroups[currentIndex]?.text && (
              <div className="bg-white text-black p-3 rounded-md shadow-sm w-[320px]">
                <h3 className="font-semibold mb-1 text-sm">Text Report Metadata</h3>
                {Object.entries(reportGroups[currentIndex].text).map(([key, value]) =>
                  key !== '_id' ? (
                    <p key={key}>
                      <strong>{key}:</strong> {String(value)}
                    </p>
                  ) : null
                )}
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex >= reportGroups.length - 1}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>Loading reports...</p>
      )}
    </div>
  );
}