'use client';

import { useState } from 'react';
import { 
  Leaderboard728x90, 
  Rectangle300x250, 
  Skyscraper160x600, 
  LargeRectangle336x280, 
  InstagramStory1080x1920 
} from '../../components/Banner/GoogleBanners';
import { generateBannerCopy } from '../../utils/claudeApi';

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [bannerProps, setBannerProps] = useState({
    logo: {
      src: "/placeholder-logo.png",
      alt: "Company Logo"
    },
    title: "Transform Your Business with AI",
    subtitle: "Boost productivity and efficiency with our AI solutions",
    cta: "Get Started"
  });

  const handlePromptSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const prompt = formData.get('prompt') as string;

    if (!prompt) return;

    setIsLoading(true);
    try {
      const copy = await generateBannerCopy(prompt);
      
      // Update all banners with the leaderboard copy first
      setBannerProps(prev => ({
        ...prev,
        title: copy.leaderboard.headline,
        subtitle: copy.leaderboard.subheadline,
        cta: copy.leaderboard.cta
      }));
    } catch (error) {
      console.error('Error generating copy:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-12 text-center text-gray-900">
        AI Banner Generator
      </h1>

      {/* Prompt Input */}
      <div className="max-w-2xl mx-auto mb-12">
        <form onSubmit={handlePromptSubmit} className="space-y-4">
          <textarea
            name="prompt"
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your prompt to generate banner copy..."
            rows={4}
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Banner Copy'}
          </button>
        </form>
      </div>
      
      <div className="max-w-[1000px] mx-auto space-y-12">
        {/* Leaderboard Banner */}
        <section>
          <h2 className="text-lg font-medium text-gray-600 mb-4">Leaderboard (728x90)</h2>
          <div className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white overflow-auto">
            <Leaderboard728x90 {...bannerProps} />
          </div>
        </section>

        {/* Medium Rectangle Banner */}
        <section>
          <h2 className="text-lg font-medium text-gray-600 mb-4">Medium Rectangle (300x250)</h2>
          <div className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white overflow-auto">
            <Rectangle300x250 {...bannerProps} />
          </div>
        </section>

        {/* Large Rectangle Banner */}
        <section>
          <h2 className="text-lg font-medium text-gray-600 mb-4">Large Rectangle (336x280)</h2>
          <div className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white overflow-auto">
            <LargeRectangle336x280 {...bannerProps} />
          </div>
        </section>

        {/* Skyscraper Banner */}
        <section>
          <h2 className="text-lg font-medium text-gray-600 mb-4">Skyscraper (160x600)</h2>
          <div className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white overflow-auto">
            <Skyscraper160x600 {...bannerProps} />
          </div>
        </section>

        {/* Instagram Story Banner */}
        <section>
          <h2 className="text-lg font-medium text-gray-600 mb-4">Instagram Story (1080x1920)</h2>
          <div className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white overflow-auto">
            <InstagramStory1080x1920 {...bannerProps} />
          </div>
        </section>
      </div>
    </main>
  );
} 