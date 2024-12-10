'use client';

import React, { useEffect, useState } from 'react';
import { useGradient } from '../../hooks/useGradient';

interface ButtonStyle {
  backgroundColor: string;
  textColor: string;
}

function useButtonStyle() {
  const [buttonStyle, setButtonStyle] = useState<ButtonStyle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchButtonStyle() {
      try {
        const response = await fetch('/button-styles.json');
        const data = await response.json();
        const buttonStyles = Object.values(data.buttons);
        const randomStyle = buttonStyles[Math.floor(Math.random() * buttonStyles.length)] as ButtonStyle;
        setButtonStyle({
          backgroundColor: randomStyle.backgroundColor,
          textColor: randomStyle.textColor
        });
      } catch (error) {
        console.error('Error loading button styles:', error);
        // Fallback style
        setButtonStyle({
          backgroundColor: '#3B82F6',
          textColor: '#FFFFFF'
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchButtonStyle();
  }, []);

  return { buttonStyle, isLoading };
}

// Character limits for each banner type with ranges
const BANNER_LIMITS = {
  leaderboard: {
    title: { min: 25, max: 35 },
    subtitle: { min: 50, max: 70 }
  },
  rectangle: {
    title: { min: 20, max: 30 },
    subtitle: { min: 70, max: 90 }
  },
  skyscraper: {
    title: { min: 15, max: 25 },
    subtitle: { min: 90, max: 120 }
  }
} as const;

interface CTAButtonProps {
  text: string;
  className?: string;
  onClick?: () => void;
}

function CTAButton({ text, className = '', onClick }: CTAButtonProps) {
  const { buttonStyle, isLoading } = useButtonStyle();

  if (isLoading) {
    return (
      <button 
        className={`
          bg-gray-200 
          text-transparent 
          animate-pulse
          rounded-full 
          ${className}
        `}
      >
        {text}
      </button>
    );
  }

  return (
    <button 
      onClick={onClick}
      style={{
        backgroundColor: buttonStyle?.backgroundColor,
        color: buttonStyle?.textColor,
        boxShadow: `0 2px 8px ${buttonStyle?.backgroundColor}80`,
        transform: 'translateY(-1px)'
      }}
      className={`
        text-sm 
        font-medium 
        rounded-full 
        transition-all
        duration-150
        ${className}
      `}
    >
      {text}
    </button>
  );
}

interface BannerProps {
  logo?: {
    src: string;
    alt: string;
  };
  title: string;
  subtitle?: string;
  cta: string;
}

// Utility function to validate text length
function validateTextLength(text: string, range: { min: number; max: number }): boolean {
  return text.length >= range.min && text.length <= range.max;
}

// Leaderboard (728x90)
export function Leaderboard728x90({ logo, title, subtitle, cta }: BannerProps) {
  const { gradientStyle, isDark, isLoading } = useGradient();
  
  console.log('Gradient Class:', gradientStyle); // Debug log

  // Development-time validation
  if (process.env.NODE_ENV === 'development') {
    if (!validateTextLength(title, BANNER_LIMITS.leaderboard.title)) {
      console.warn(`Leaderboard title should be between ${BANNER_LIMITS.leaderboard.title.min}-${BANNER_LIMITS.leaderboard.title.max} characters. Current: ${title.length}`);
    }
    if (subtitle && !validateTextLength(subtitle, BANNER_LIMITS.leaderboard.subtitle)) {
      console.warn(`Leaderboard subtitle should be between ${BANNER_LIMITS.leaderboard.subtitle.min}-${BANNER_LIMITS.leaderboard.subtitle.max} characters. Current: ${subtitle.length}`);
    }
  }

  if (isLoading) {
    return <div className="w-[728px] h-[90px] animate-pulse bg-gray-200 rounded-lg" />;
  }

  return (
    <div style={gradientStyle} className="relative w-[728px] h-[90px] rounded-lg overflow-hidden">
      <div className="flex h-full items-center">
        {/* Logo Section */}
        <div className="w-[120px] h-full flex items-center justify-center border-r border-white/20">
          {logo ? (
            <img src={logo.src} alt={logo.alt} className="w-[80px] h-[40px] object-contain" />
          ) : (
            <div className="w-[80px] h-[40px] bg-white/10 rounded-md animate-pulse" />
          )}
        </div>
        
        {/* Content Section */}
        <div className="flex-1 flex items-center justify-between pl-6 pr-8">
          <div className="flex flex-col">
            <h2 className={`text-[18px] font-semibold leading-tight mb-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h2>
            {subtitle && (
              <p className={`text-[13px] ${isDark ? 'text-white/90' : 'text-gray-600'}`}>
                {subtitle}
              </p>
            )}
          </div>
          <CTAButton 
            text={cta}
            className="ml-4 px-6 h-[36px]"
          />
        </div>
      </div>
    </div>
  );
}

// Medium Rectangle (300x250)
export function Rectangle300x250({ logo, title, subtitle, cta }: BannerProps) {
  const { gradientStyle, isDark, isLoading } = useGradient();

  // Development-time validation
  if (process.env.NODE_ENV === 'development') {
    if (!validateTextLength(title, BANNER_LIMITS.rectangle.title)) {
      console.warn(`Rectangle title should be between ${BANNER_LIMITS.rectangle.title.min}-${BANNER_LIMITS.rectangle.title.max} characters. Current: ${title.length}`);
    }
    if (subtitle && !validateTextLength(subtitle, BANNER_LIMITS.rectangle.subtitle)) {
      console.warn(`Rectangle subtitle should be between ${BANNER_LIMITS.rectangle.subtitle.min}-${BANNER_LIMITS.rectangle.subtitle.max} characters. Current: ${subtitle.length}`);
    }
  }

  if (isLoading) {
    return <div className="w-[300px] h-[250px] animate-pulse bg-gray-200 rounded-lg" />;
  }

  return (
    <div style={gradientStyle} className="relative w-[300px] h-[250px] rounded-lg overflow-hidden">
      {/* Logo Section */}
      <div className="h-[50px] flex items-center px-5 border-b border-gray-100 bg-white/50">
        {logo ? (
          <img src={logo.src} alt={logo.alt} className="h-[28px] object-contain" />
        ) : (
          <div className="h-[28px] w-[90px] bg-gray-100 rounded-md animate-pulse" />
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-5 flex flex-col h-[200px]">
        <div className="flex-1">
          <h2 className={`text-[20px] font-semibold leading-tight mb-2 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`text-[13px] leading-snug line-clamp-3 ${isDark ? 'text-white/90' : 'text-gray-600'}`}>
              {subtitle}
            </p>
          )}
        </div>
        <CTAButton 
          text={cta}
          className="w-full h-[40px]"
        />
      </div>
    </div>
  );
}

// Skyscraper (160x600)
export function Skyscraper160x600({ logo, title, subtitle, cta }: BannerProps) {
  const { gradientStyle, isDark, isLoading } = useGradient();

  // Development-time validation
  if (process.env.NODE_ENV === 'development') {
    if (!validateTextLength(title, BANNER_LIMITS.skyscraper.title)) {
      console.warn(`Skyscraper title should be between ${BANNER_LIMITS.skyscraper.title.min}-${BANNER_LIMITS.skyscraper.title.max} characters. Current: ${title.length}`);
    }
    if (subtitle && !validateTextLength(subtitle, BANNER_LIMITS.skyscraper.subtitle)) {
      console.warn(`Skyscraper subtitle should be between ${BANNER_LIMITS.skyscraper.subtitle.min}-${BANNER_LIMITS.skyscraper.subtitle.max} characters. Current: ${subtitle.length}`);
    }
  }

  if (isLoading) {
    return <div className="w-[160px] h-[600px] animate-pulse bg-gray-200 rounded-lg" />;
  }

  return (
    <div style={gradientStyle} className="relative w-[160px] h-[600px] rounded-lg overflow-hidden">
      {/* Logo Section */}
      <div className="h-[80px] flex items-center justify-center border-b border-gray-100 bg-white/50">
        {logo ? (
          <img src={logo.src} alt={logo.alt} className="h-[40px] object-contain" />
        ) : (
          <div className="h-[40px] w-[100px] bg-gray-100 rounded-md animate-pulse" />
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-4 flex flex-col h-[520px]">
        <div className="flex-1 pt-4">
          <h2 className={`text-[18px] font-semibold leading-tight mb-3 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h2>
          {subtitle && (
            <p className={`text-[13px] leading-relaxed text-center mb-6 ${isDark ? 'text-white/90' : 'text-gray-600'}`}>
              {subtitle}
            </p>
          )}
        </div>
        <CTAButton 
          text={cta}
          className="w-full h-[40px]"
        />
      </div>
    </div>
  );
} 