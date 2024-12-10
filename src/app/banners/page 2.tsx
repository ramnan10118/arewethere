'use client';

import React from 'react';
import GoogleBanner from '../../components/Banner/GoogleBanner';

export default function Home() {
  return (
    <main className="min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-8">Banner Generator</h1>
      
      <div className="border border-gray-200 rounded-lg p-4 shadow-lg">
        <GoogleBanner
          logo={{
            src: "/placeholder-logo.png",
            alt: "Company Logo"
          }}
          title="Transform Your Business with AI"
          subtitle="Boost productivity by 10x with our cutting-edge solutions"
          cta="Get Started Free"
          disclaimer="*Terms and conditions apply. Results may vary."
          backgroundColor="#f8fafc"
        />
      </div>
    </main>
  );
} 