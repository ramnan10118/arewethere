'use client';

import React, { useEffect, useState, createElement } from 'react';
import { useGradient } from '../../hooks/useGradient';
import Image from 'next/image';
import localFont from 'next/font/local';

// Load Euclid fonts
const euclidRegular = localFont({
  src: '../../../public/fonts/EuclidCircularB-Regular.ttf',
  variable: '--font-euclid-regular'
});

const euclidMedium = localFont({
  src: '../../../public/fonts/EuclidCircularB-Medium.ttf',
  variable: '--font-euclid-medium'
});

const euclidSemibold = localFont({
  src: '../../../public/fonts/EuclidCircularB-SemiBold.ttf',
  variable: '--font-euclid-semibold'
});

const euclidBold = localFont({
  src: '../../../public/fonts/EuclidCircularB-Bold.ttf',
  variable: '--font-euclid-bold'
});

const euclidItalic = localFont({
  src: '../../../public/fonts/EuclidCircularB-Italic.ttf',
  variable: '--font-euclid-italic'
});

interface LogoProps {
  isDark: boolean;
  width: number;
  height: number;
  className?: string;
}

function Logo({ isDark, width, height, className = '' }: LogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {isDark ? (
        <Image
          src="/logo-light.svg"
          alt="Logo Light"
          width={width}
          height={height}
          className="object-contain"
        />
      ) : (
        <Image
          src="/logo-dark.svg"
          alt="Logo Dark"
          width={width}
          height={height}
          className="object-contain"
        />
      )}
    </div>
  );
}

type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold';
type Element = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

interface TypographyProps {
  children: React.ReactNode;
  weight?: FontWeight;
  italic?: boolean;
  as?: Element;
  className?: string;
}

function BannerText({ 
  children, 
  weight = 'regular', 
  italic = false,
  as = 'p',
  className = ''
}: TypographyProps) {
  // Get the appropriate font based on weight and italic
  let font;
  if (italic) {
    font = euclidItalic;
  } else {
    switch (weight) {
      case 'medium':
        font = euclidMedium;
        break;
      case 'semibold':
        font = euclidSemibold;
        break;
      case 'bold':
        font = euclidBold;
        break;
      default:
        font = euclidRegular;
    }
  }

  return createElement(
    as,
    {
      className: `${font.className} ${className}`,
    },
    children
  );
}

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

interface DisclaimerProps {
  text: string;
  isDark?: boolean;
  className?: string;
}

function Disclaimer({ text, isDark, className = '' }: DisclaimerProps) {
  return (
    <div className={`absolute bottom-2 left-0 right-0 px-2 ${className}`}>
      <BannerText
        as="p"
        weight="regular"
        className={`text-[8px] text-center ${isDark ? 'text-white/60' : 'text-gray-500'}`}
      >
        {text}
      </BannerText>
    </div>
  );
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
          <Logo 
            isDark={isDark} 
            width={80} 
            height={40}
            className="flex items-center justify-center"
          />
        </div>
        
        {/* Content Section */}
        <div className="flex-1 flex items-center justify-between pl-6 pr-8">
          <div className="flex flex-col">
            <BannerText 
              as="h2" 
              weight="semibold"
              className={`text-[18px] leading-tight mb-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              {title}
            </BannerText>
            {subtitle && (
              <BannerText 
                as="p"
                weight="regular"
                className={`text-[13px] ${isDark ? 'text-white/90' : 'text-gray-600'}`}
              >
                {subtitle}
              </BannerText>
            )}
          </div>
          <CTAButton 
            text={cta}
            className="ml-4 px-6 h-[36px]"
          />
        </div>
      </div>
      {/* <Disclaimer 
        text="*Terms and conditions apply"
        isDark={isDark}
      /> */}
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
      <div className="p-5 flex flex-col h-full">
        <Logo 
          isDark={isDark} 
          width={70} 
          height={22}
          className="mb-6"
        />
        <div className="flex-1">
          <BannerText 
            as="h2"
            weight="semibold"
            className={`text-[20px] leading-tight mb-2 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            {title}
          </BannerText>
          {subtitle && (
            <BannerText 
              as="p"
              weight="regular"
              className={`text-[13px] leading-snug line-clamp-3 ${isDark ? 'text-white/90' : 'text-gray-600'}`}
            >
              {subtitle}
            </BannerText>
          )}
        </div>
        <CTAButton 
          text={cta}
          className="w-full h-[40px]"
        />
      </div>
      {/* <Disclaimer 
        text="*Terms and conditions apply"
        isDark={isDark}
      /> */}
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
      <div className="p-4 flex flex-col h-full">
        <Logo 
          isDark={isDark} 
          width={60} 
          height={24}
          className="mb-6 mx-auto"
        />
        <div className="flex-1 grid place-content-center text-center">
          <BannerText 
            as="h2"
            weight="semibold"
            className={`text-[18px] leading-tight mb-3 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            {title}
          </BannerText>
          {subtitle && (
            <BannerText 
              as="p"
              weight="regular"
              className={`text-[13px] leading-relaxed text-center mb-6 ${isDark ? 'text-white/90' : 'text-gray-600'}`}
            >
              {subtitle}
            </BannerText>
          )}
        </div>
        <CTAButton 
          text={cta}
          className="w-full h-[40px]"
        />
      </div>
      {/* <Disclaimer 
        text="*Terms and conditions apply"
        isDark={isDark}
      /> */}
    </div>
  );
} 

// Large Rectangle (336x280)
export function LargeRectangle336x280({ logo, title, subtitle, cta }: BannerProps) {
  const { gradientStyle, isDark, isLoading } = useGradient();

  // Development-time validation
  if (process.env.NODE_ENV === 'development') {
    if (!validateTextLength(title, BANNER_LIMITS.rectangle.title)) {
      console.warn(`Large Rectangle title should be between ${BANNER_LIMITS.rectangle.title.min}-${BANNER_LIMITS.rectangle.title.max} characters. Current: ${title.length}`);
    }
    if (subtitle && !validateTextLength(subtitle, BANNER_LIMITS.rectangle.subtitle)) {
      console.warn(`Large Rectangle subtitle should be between ${BANNER_LIMITS.rectangle.subtitle.min}-${BANNER_LIMITS.rectangle.subtitle.max} characters. Current: ${subtitle.length}`);
    }
  }

  if (isLoading) {
    return <div className="w-[336px] h-[280px] animate-pulse bg-gray-200 rounded-lg" />;
  }

  return (
    <div style={gradientStyle} className="relative w-[336px] h-[280px] rounded-lg overflow-hidden">
      <div className="p-5 flex flex-col h-full">
        <Logo 
          isDark={isDark} 
          width={80} 
          height={24}
          className="mb-6"
        />
        <div className="flex-1">
          <BannerText 
            as="h2"
            weight="semibold"
            className={`text-[22px] leading-tight mb-2 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            {title}
          </BannerText>
          {subtitle && (
            <BannerText 
              as="p"
              weight="regular"
              className={`text-[14px] leading-snug line-clamp-3 ${isDark ? 'text-white/90' : 'text-gray-600'}`}
            >
              {subtitle}
            </BannerText>
          )}
        </div>
        <CTAButton 
          text={cta}
          className="w-full h-[40px]"
        />
      </div>
      {/* <Disclaimer 
        text="*Terms and conditions apply"
        isDark={isDark}
      /> */}
    </div>
  );
} 

// Instagram Story (1080x1920)
export function InstagramStory1080x1920({ logo, title, subtitle, cta }: BannerProps) {
  const { gradientStyle, isDark, isLoading } = useGradient();

  if (isLoading) {
    return <div className="w-[270px] h-[480px] animate-pulse bg-gray-200 rounded-lg" />;
  }

  return (
    <div style={gradientStyle} className="relative w-[270px] h-[480px] rounded-2xl overflow-hidden">
      <div className="p-6 flex flex-col h-full">
        {/* Top Section with Logo */}
        <Logo 
          isDark={isDark} 
          width={80} 
          height={24}
          className="mb-auto"
        />
        
        {/* Content Section - Centered */}
        <div className="flex-1 grid place-content-center text-center px-4">
          <BannerText 
            as="h2"
            weight="semibold"
            className={`text-[24px] leading-tight mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            {title}
          </BannerText>
          {subtitle && (
            <BannerText 
              as="p"
              weight="regular"
              className={`text-[16px] leading-relaxed mb-8 ${isDark ? 'text-white/90' : 'text-gray-600'}`}
            >
              {subtitle}
            </BannerText>
          )}
          <CTAButton 
            text={cta}
            className="w-full h-[44px] text-[15px]"
          />
        </div>
      </div>
      {/* <Disclaimer 
        text="*Terms and conditions apply"
        isDark={isDark}
      /> */}
    </div>
  );
} 

// Leaderboard Variation (728x90)
export function LeaderboardVariation728x90({ logo, title, subtitle, cta }: BannerProps) {
  const { gradientStyle, isDark, isLoading } = useGradient();

  if (isLoading) {
    return (
      <div className="w-[728px] h-[90px] bg-gray-100 animate-pulse rounded-lg" />
    );
  }

  return (
    <div 
      className={`w-[728px] h-[90px] relative overflow-hidden rounded-lg ${gradientStyle}`}
    >
      {/* Content Container */}
      <div className="w-full h-full flex items-center justify-between px-8 relative">
        {/* Left Content */}
        <div className="flex-1 flex flex-col justify-center">
          <BannerText
            as="h2"
            weight="bold"
            className={`text-xl mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}
          >
            {title}
          </BannerText>
          <BannerText
            weight="medium"
            className={`text-sm ${isDark ? 'text-white/80' : 'text-gray-700'} max-w-[400px]`}
          >
            {subtitle}
          </BannerText>
        </div>

        {/* Right Content */}
        <div className="flex items-center gap-6">
          <CTAButton 
            text={cta}
            className="px-6 py-2.5 text-sm font-medium hover:scale-105 transition-transform"
          />
          <Logo 
            isDark={isDark}
            width={80}
            height={24}
            className="flex-shrink-0"
          />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-black/5 rounded-full blur-xl" />
      </div>
    </div>
  );
} 