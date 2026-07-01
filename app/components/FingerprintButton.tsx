'use client';

import Image from 'next/image';
import React from 'react';

const FingerprintButton = () => {
  return (
    <button className="flex items-center justify-center p-4 bg-gray-800 rounded-full hover:bg-gray-700">
      <Image
        src="/Fingerprint_round.png"
        alt="Fingerprint"
        width={80}
        height={80}
        // Optional: makes black icons white
      />
    </button>
  );
};

export default FingerprintButton;
