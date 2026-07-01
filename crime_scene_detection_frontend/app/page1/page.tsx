// 👇 Looks like it's inside app/page1/page.tsx or should be moved there
// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import TypingText from '../components/TypingText';

// export default function Page1() {
//   const router = useRouter();

//   useEffect(() => {
//     const isAdmin = JSON.parse(localStorage.getItem('isAdmin') || 'false');
//     if (isAdmin) {
//       // Redirect admin to their dashboard
//       router.push('/page4');
//     }
//   }, []);

//   return (
//     <div className="flex flex-col h-screen w-screen bg-black justify-center items-center relative overflow-hidden">
//       {/* Detective GIF */}
//       <div className="absolute left-[25rem] bottom-[4rem] z-10">
//         <img src="/videos/walking.gif" alt="Detective" />
//       </div>

//       {/* Typing Text & Button */}
//       <div className="z-20 flex flex-col items-center space-y-4">
//         <TypingText text="Hello from the detective" speed={50} />

//         <a
//           href="/page2"
//           className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//         >
//           Next
//         </a>
//       </div>
//     </div>
//   );
// }




'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TypingText from '../components/TypingText';

export default function Page1() {
  const router = useRouter();

  useEffect(() => {
    try {
      const isAdminRaw = localStorage.getItem('isAdmin');
      const isAdmin = isAdminRaw && JSON.parse(isAdminRaw);

      if (isAdmin) {
        router.push('/page4'); // redirect admin to their dashboard
      }
    } catch (error) {
      console.error("❌ Failed to parse isAdmin:", error);
    }
  }, [router]);

  return (
    <div className="flex flex-col h-screen w-screen bg-black justify-center items-center relative overflow-hidden text-white">
      {/* Detective GIF */}
      <div className="absolute left-[17rem] bottom-[10rem] z-10">
        <img src="/videos/walking.gif" alt="Detective" className="h-120" />
      </div>

      {/* Typing Text & Button */}
      <div className="z-70 flex flex-col items-center space-y-10">
        <TypingText text="Deetective at your service!" speed={50} />

        <a
          href="/page2"
          className="bg-gray-600 text-white px-5 py-2 rounded-xl hover:bg-gray-600 transition"
        >
          Next
        </a>
      </div>
    </div>
  );
}
