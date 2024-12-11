'use client';

import { useState } from 'react';
import { useGradient } from '../../hooks/useGradient';
import { 
  Leaderboard728x90, 
  Rectangle300x250, 
  Skyscraper160x600, 
  LargeRectangle336x280, 
  InstagramStory1080x1920,
  TestimonialLeaderboard728x90,
  InstagramSquare1080,
  InstagramSquare1080Flipped,
  InstagramSquare1080Float,
  InstagramSquare1080Character
} from '../../components/Banner/GoogleBanners';
import { generateBannerCopy } from '../../utils/claudeApi';

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const { gradientStyle } = useGradient();
  const [bannerProps, setBannerProps] = useState({
    logo: {
      src: "/placeholder-logo.png",
      alt: "Company Logo"
    },
    title: "Transform Your Business with AI",
    subtitle: "Boost productivity and efficiency with our AI solutions",
    cta: "Get Started",
    gradientStyle
  });

  const handlePromptSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const prompt = formData.get('prompt') as string;

    if (!prompt) return;

    setIsLoading(true);
    try {
      const copy = await generateBannerCopy(prompt);
      
      setBannerProps(prev => ({
        ...prev,
        title: copy.leaderboard.headline,
        subtitle: copy.leaderboard.subheadline,
        cta: copy.leaderboard.cta || "Get Started"
      }));
    } catch (error) {
      console.error('Error generating copy:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex">
      {/* Left Side - Form (30%) */}
      {/* 
      <div className="w-[30%] h-screen sticky top-0 p-8 border-r bg-white">
        <h1 className="text-2xl font-bold mb-8">Banner Generator</h1>
        <form onSubmit={handlePromptSubmit} className="space-y-4">
          <input 
            type="text" 
            name="prompt" 
            placeholder="Enter your prompt..."
            className="w-full p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </form>
      </div>
      */}

      {/* Right Side - Banners (70%) */}
      <div className="w-full p-8 overflow-y-auto">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Original Banner */}
          <div className="flex flex-col items-center">
            <h2 className="text-base font-semibold mb-4">Instagram Square - Style 1</h2>
            <InstagramSquare1080 {...bannerProps} />
          </div>

          {/* Flipped Banner */}
          <div className="flex flex-col items-center">
            <h2 className="text-base font-semibold mb-4">Instagram Square - Style 2</h2>
            <InstagramSquare1080Flipped {...bannerProps} />
          </div>
        </div>

        {/* Floating Image Banner */}
        <div className="flex flex-col items-center">
          <h2 className="text-base font-semibold mb-4">Instagram Square - Floating Style</h2>
          <InstagramSquare1080Float {...bannerProps} />
        </div>

        {/* Character Banner */}
        <div className="flex flex-col items-center">
          <h2 className="text-base font-semibold mb-4">Instagram Square - Character Style</h2>
          <InstagramSquare1080Character {...bannerProps} />
        </div>
      </div>
    </main>
  );
} 