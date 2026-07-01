// // "use client";

// // import { useState, useEffect } from "react";
// // import TypingText from "./components/TypingText"; // Adjust path if needed
// // import { useRouter } from "next/navigation";

// // export default function HomePage() {
// //   const router = useRouter();

// //   return (
// //     <Page1 />
// //   );
// // }

// // function Page1() {
// //   return (
// //     <div className="flex flex-col h-screen w-screen bg-black justify-center items-center relative overflow-hidden">

// //       <div className="absolute left-[25rem] bottom-[4rem] z-10">
// //         <img
// //           src="/videos/walking.gif"
// //           alt="Detective"
// //           className=""
// //         />
// //       </div>

// //       <div>
// //         <TypingText text="Deetective at your service!" speed={50} />
// //         <button className="fixed bottom-30 right-140 bg-gray-500 text-white px-4 py-2 rounded">
// //           <a href="/page2">Next</a>
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';

// export default function AuthPage() {
//   const [isSignIn, setIsSignIn] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [isAdminSignup, setIsAdminSignup] = useState(false);

//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // ✅ Detect if ?asAdmin=true is present
//   useEffect(() => {
//     const isAdmin = searchParams.get('asAdmin');
//     setIsAdminSignup(isAdmin === 'true');
//   }, [searchParams]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const endpoint = isSignIn
//       ? '/api/user/signin'
//       : isAdminSignup
//       ? '/api/admin/signup'
//       : '/api/user/signup';

//     const res = await fetch(endpoint, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       setMessage(data.message);

//       // ✅ Save role to localStorage
//       localStorage.setItem('isAdmin', JSON.stringify(data.isAdmin));

//       // ✅ Redirect
//       if (data.isAdmin) {
//         router.push('/page4');
//       } else {
//         router.push('/page1');
//       }
//     } else {
//       setMessage(data.error || 'Request failed');
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-md">
//       <h1 className="text-2xl font-bold mb-4 text-center">
//         {isSignIn
//           ? 'Sign In'
//           : isAdminSignup
//           ? 'Admin Sign Up'
//           : 'Sign Up'}
//       </h1>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full p-2 border rounded"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full p-2 border rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//         >
//           {isSignIn ? 'Sign In' : 'Sign Up'}
//         </button>
//       </form>

//       {message && (
//         <p className="mt-4 text-center text-red-500">{message}</p>
//       )}

//       <p className="mt-6 text-center text-sm">
//         {isSignIn ? "Don't have an account?" : 'Already have an account?'}{' '}
//         <button
//           onClick={() => {
//             setIsSignIn(!isSignIn);
//             setMessage('');
//           }}
//           className="text-blue-600 underline"
//         >
//           {isSignIn ? 'Sign Up' : 'Sign In'}
//         </button>
//       </p>
//     </div>
//   );
// }



"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isAdminSignup, setIsAdminSignup] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const isAdmin = searchParams.get('asAdmin');
    setIsAdminSignup(isAdmin === 'true');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = isSignIn
      ? '/api/user/signin'
      : isAdminSignup
        ? '/api/admin/signup'
        : '/api/user/signup';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);

        localStorage.setItem('isAdmin', JSON.stringify(data.isAdmin));

        if (data.isAdmin) {
          router.push('/page4');
        } else {
          router.push('/page1');
        }
      } else {
        setMessage(data.error || 'Request failed');
      }
    } catch (error) {
      console.error("❌ Fetch failed:", error);
      setMessage("Something went wrong. Please check your connection.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="max-w-md w-full p-6 border border-gray-700 rounded-xl shadow-md bg-gray-900">

        {/* ✅ DEBUG LINE — shows page has rendered */}
        <p className="text-red-500 text-center mb-4">🔥 Page loaded — visible!</p>

        <h1 className="text-2xl font-bold mb-4 text-center">
          {isSignIn
            ? 'Sign In'
            : isAdminSignup
              ? 'Admin Sign Up'
              : 'Sign Up'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {isSignIn ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-red-500">{message}</p>
        )}

        <p className="mt-6 text-center text-sm">
          {isSignIn ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => {
              setIsSignIn(!isSignIn);
              setMessage('');
            }}
            className="text-blue-400 underline hover:text-blue-300"
          >
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );

}
