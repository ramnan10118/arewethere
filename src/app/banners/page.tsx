'use client';

import { useState } from 'react';
import { useGradient } from '../../hooks/useGradient';
import { 
  Leaderboard728x90, 
  Rectangle300x250, 
  Skyscraper160x600, 
  LargeRectangle336x280, 
  InstagramStory1080x1920,
  BackgroundLeaderboard728x90,
  InstagramSquare1080,
  InstagramSquare1080Flipped,
  InstagramSquare1080Float,
  InstagramSquare1080Character,
  InstagramSquare1080Background,
  InstagramSquare1080Testimonial,
  ComparisonBanner1080,
  FeatureMatrixBanner1080
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
  const [selectedLOB, setSelectedLOB] = useState('auto');

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
    <main className="min-h-screen">
      {/* Banners */}
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

        {/* Floating and Character Banners Side by Side */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col items-center">
            <h2 className="text-base font-semibold mb-4">Instagram Square - Character Style</h2>
            <InstagramSquare1080Character 
              {...bannerProps} 
              lob={selectedLOB}
            />
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-base font-semibold mb-4">Instagram Square - Float Style</h2>
            <InstagramSquare1080Float 
              {...bannerProps} 
              lob={selectedLOB}
            />
          </div>
        </div>

        {/* Testimonial and Background Banners Side by Side */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col items-center">
            <h2 className="text-base font-semibold mb-4">Instagram Square - Testimonial Style</h2>
            <InstagramSquare1080Testimonial {...bannerProps} />
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-base font-semibold mb-4">Instagram Square - Background Style</h2>
            <InstagramSquare1080Background 
              {...bannerProps} 
              lob={selectedLOB}
            />
          </div>
        </div>

        {/* Comparison Banners */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col items-center">
            <h2 className="text-base font-semibold mb-4">Instagram Square - Comparison</h2>
            <ComparisonBanner1080 {...bannerProps} />
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-base font-semibold mb-4">Instagram Square - Feature Matrix</h2>
            <FeatureMatrixBanner1080 {...bannerProps} />
          </div>
        </div>
      </div>
    </main>
  );
} 