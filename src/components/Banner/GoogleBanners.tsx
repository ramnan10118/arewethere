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
  text: string | React.ReactNode;
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
        <BannerText weight="medium">{text}</BannerText>
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
        transform: 'translateY(-1px)',
        padding: '0'
      }}
      className={`
        rounded-full 
        transition-all
        duration-150
        ${className}
      `}
    >
      <BannerText weight="medium">{text}</BannerText>
    </button>
  );
}

interface BannerProps {
  logo?: {
    src: string;
    alt: string;
  };
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  cta: string | React.ReactNode;
}

// Utility function to validate text length
function validateTextLength(text: React.ReactNode, range: { min: number; max: number }): boolean {
  if (typeof text === 'string') {
    return text.length >= range.min && text.length <= range.max;
  }
  // For non-string ReactNode, skip validation
  return true;
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
    if (typeof title === 'string' && !validateTextLength(title, BANNER_LIMITS.leaderboard.title)) {
      console.warn(`Leaderboard title should be between ${BANNER_LIMITS.leaderboard.title.min}-${BANNER_LIMITS.leaderboard.title.max} characters. Current: ${title.length}`);
    }
    if (subtitle && typeof subtitle === 'string' && !validateTextLength(subtitle, BANNER_LIMITS.leaderboard.subtitle)) {
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
          <div className="flex flex-col max-w-[400px]">
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
            className="ml-4 px-6 h-[36px] whitespace-nowrap min-w-[140px]"
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
    if (typeof title === 'string' && !validateTextLength(title, BANNER_LIMITS.rectangle.title)) {
      console.warn(`Rectangle title should be between ${BANNER_LIMITS.rectangle.title.min}-${BANNER_LIMITS.rectangle.title.max} characters. Current: ${title.length}`);
    }
    if (subtitle && typeof subtitle === 'string' && !validateTextLength(subtitle, BANNER_LIMITS.rectangle.subtitle)) {
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
    if (typeof title === 'string' && !validateTextLength(title, BANNER_LIMITS.skyscraper.title)) {
      console.warn(`Skyscraper title should be between ${BANNER_LIMITS.skyscraper.title.min}-${BANNER_LIMITS.skyscraper.title.max} characters. Current: ${title.length}`);
    }
    if (subtitle && typeof subtitle === 'string' && !validateTextLength(subtitle, BANNER_LIMITS.skyscraper.subtitle)) {
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
    if (typeof title === 'string' && !validateTextLength(title, BANNER_LIMITS.rectangle.title)) {
      console.warn(`Large Rectangle title should be between ${BANNER_LIMITS.rectangle.title.min}-${BANNER_LIMITS.rectangle.title.max} characters. Current: ${title.length}`);
    }
    if (subtitle && typeof subtitle === 'string' && !validateTextLength(subtitle, BANNER_LIMITS.rectangle.subtitle)) {
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

interface BackgroundBannerProps extends BannerProps {
  customer: {
    name: string;
    role: string;
    image: string;
  };
  backgroundImage?: string;
}

// Background Leaderboard (728x90)
export function BackgroundLeaderboard728x90({ 
  logo, 
  title, 
  subtitle, 
  cta, 
  backgroundImage = "/images/car/cars/Car_15.png",
  customer = {
    name: "Priya Sharma",
    role: "Product Designer",
    image: "/placeholder-avatar.png"
  }
}: BackgroundBannerProps) {
  const { isDark, isLoading } = useGradient();

  if (isLoading) {
    return <div className="w-[728px] h-[90px] animate-pulse bg-gray-200 rounded-lg" />;
  }

  return (
    <div className="relative w-[728px] h-[90px] rounded-lg overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" /> {/* Dark overlay for better text contrast */}
      </div>

      <div className="relative flex h-full items-center z-10">
        {/* Logo Section */}
        <div className="w-[120px] h-full flex items-center justify-center border-r border-white/20">
          <Logo 
            isDark={true}
            width={80} 
            height={40}
            className="flex items-center justify-center"
          />
        </div>
        
        {/* Content Section */}
        <div className="flex-1 flex items-center justify-between pl-6 pr-8">
          <div className="flex flex-col max-w-[400px]">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative w-[28px] h-[28px] rounded-full overflow-hidden bg-white/10 flex-shrink-0">
                <Image
                  src={customer.image}
                  alt={customer.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-2">
                <BannerText 
                  as="span" 
                  weight="semibold"
                  className="text-[14px] text-white"
                >
                  {customer.name}
                </BannerText>
                <span className="text-[12px] text-white/70">•</span>
                <BannerText 
                  as="span"
                  weight="regular"
                  className="text-[12px] text-white/70"
                >
                  {customer.role}
                </BannerText>
              </div>
            </div>
            <BannerText 
              as="p"
              weight="regular"
              className="text-[13px] leading-snug text-white/90"
            >
              &ldquo;{subtitle}&rdquo;
            </BannerText>
          </div>

          <CTAButton 
            text={cta}
            className="ml-4 px-6 h-[36px] whitespace-nowrap min-w-[140px]"
          />
        </div>
      </div>
    </div>
  );
} 

// Instagram Square (1080x1080)
export function InstagramSquare1080({ logo, title, subtitle, cta, lob = 'auto' }: BannerProps & { lob?: string }) {
  const { gradientStyle, isDark, isLoading } = useGradient();
  const [randomImage, setRandomImage] = useState('');

  const getFloatImages = () => {
    const autoImages = [
      '/images/auto/full/full_1.png',
      '/images/auto/full/full_2.png'
      
    ];

    const healthImages = [
      '/images/health/full/full_1.png',
      '/images/health/full/Full_2.png',
      '/images/health/full/Full_3.png',
      '/images/health/full/Full_4.png'
    ];
    console.log('Square selecting images for LOB:', lob.toLowerCase());
      
    switch(lob.toLowerCase()) {
      case 'auto':
        console.log('Selected auto images');
        return autoImages;
      case 'health':
        console.log('Selected health images');
        return healthImages;
      default:
        console.log('Selected default (auto) images');
        return autoImages;
    }
  }

  useEffect(() => {
    const images = getFloatImages();
    const selectedImage = images[Math.floor(Math.random() * images.length)];
    console.log('Selected random image:', selectedImage);
    setRandomImage(selectedImage);
  }, [lob]);

  if (isLoading) {
    return <div className="w-[500px] h-[500px] animate-pulse bg-gray-200 rounded-lg" />;
  }

  return (
    <div style={gradientStyle} className="relative w-[500px] h-[500px] rounded-2xl overflow-hidden">
      {/* Logo Section - Spans full width */}
      <div className="absolute top-0 left-0 right-0 p-8 z-10">
        <Logo 
          isDark={isDark} 
          width={80} 
          height={24}
        />
      </div>

      <div className="flex h-full">
        {/* Left Side - Image */}
        <div className="w-[250px] h-full relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <Image
            src={randomImage || '/images/garage/AckoGarage.png'}
            alt="Banner Image"
            fill
            className="object-cover object-left-top scale-125"
            style={{ objectPosition: '60% top' }}
            priority
          />
        </div>
        
        {/* Right Side - Content */}
        <div className="flex-1 flex flex-col pt-24 p-8 relative">
          {/* Optional gradient overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10" />
          
          {/* Content Section */}
          <div className="flex flex-col h-full relative z-10">
            {/* Text Content */}
            <div className="flex-1 flex flex-col pt-8">
              <div className="w-[200px]">
                <BannerText 
                  as="h2"
                  weight="semibold"
                  className={`text-[30px] leading-tight mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  {title}
                </BannerText>
              </div>
              {subtitle && (
                <BannerText 
                  as="p"
                  weight="regular"
                  className={`text-[18px] leading-relaxed ${isDark ? 'text-white/90' : 'text-gray-600'}`}
                >
                  {subtitle}
                </BannerText>
              )}
            </div>

            {/* CTA Button - Pushed to bottom */}
            <div className="mt-auto">
              <CTAButton 
                text={cta}
                className="w-[220px] h-[45px] !text-[16px] whitespace-nowrap"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 

// Instagram Square Flipped (1080x1080)
export function InstagramSquare1080Flipped({ logo, title, subtitle, cta, lob = 'auto' }: BannerProps & { lob?: string }) {
  const { gradientStyle, isDark, isLoading } = useGradient();
  const [randomImage, setRandomImage] = useState('');

  const getFloatImages = () => {
    const autoImages = [
      '/images/auto/full/full_1.png',
      '/images/auto/full/full_2.png'
    ];

    const healthImages = [
      '/images/health/full/full_1.png',
      '/images/health/full/Full_2.png',
      '/images/health/full/Full_3.png',
      '/images/health/full/Full_4.png'
    ];
    console.log('Square Flipped selecting images for LOB:', lob.toLowerCase());
      
    switch(lob.toLowerCase()) {
      case 'auto':
        console.log('Selected auto images');
        return autoImages;
      case 'health':
        console.log('Selected health images');
        return healthImages;
      default:
        console.log('Selected default (auto) images');
        return autoImages;
    }
  }

  useEffect(() => {
    const images = getFloatImages();
    const selectedImage = images[Math.floor(Math.random() * images.length)];
    console.log('Selected random image:', selectedImage);
    setRandomImage(selectedImage);
  }, [lob]);

  if (isLoading) {
    return <div className="w-[500px] h-[500px] animate-pulse bg-gray-200 rounded-lg" />;
  }

  return (
    <div style={gradientStyle} className="relative w-[500px] h-[500px] rounded-2xl overflow-hidden">
      {/* Logo Section - Spans full width */}
      <div className="absolute top-0 left-0 right-0 p-8 z-10">
        <Logo 
          isDark={isDark} 
          width={80} 
          height={24}
        />
      </div>

      <div className="flex h-full">
        {/* Left Side - Content */}
        <div className="flex-1 flex flex-col pt-24 p-8 relative">
          {/* Optional gradient overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
          
          {/* Content Section */}
          <div className="flex flex-col h-full relative z-10">
            {/* Text Content */}
            <div className="flex-1 flex flex-col pt-8">
              <div className="w-[200px]">
                <BannerText 
                  as="h2"
                  weight="semibold"
                  className={`text-[30px] leading-tight mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  {title}
                </BannerText>
              </div>
              {subtitle && (
                <BannerText 
                  as="p"
                  weight="regular"
                  className={`text-[18px] leading-relaxed ${isDark ? 'text-white/90' : 'text-gray-600'}`}
                >
                  {subtitle}
                </BannerText>
              )}
            </div>

            {/* CTA Button - Pushed to bottom */}
            <div className="mt-auto">
              <CTAButton 
                text={cta}
                className="w-[220px] h-[45px] !text-[16px] whitespace-nowrap"
              />
            </div>
          </div>
        </div>
        
        {/* Right Side - Image */}
        <div className="w-[250px] h-full relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <Image
            src={randomImage || '/images/garage/AckoGarage.png'}
            alt="Banner Image"
            fill
            className="object-cover object-right-top scale-125"
            style={{ objectPosition: '40% top' }}
            priority
          />
        </div>
      </div>
    </div>
  );
} 

// Instagram Square with Floating Image (1080x1080)
export function InstagramSquare1080Float({ logo, title, subtitle, cta, lob = 'auto' }: BannerProps & { lob?: string }) {
  const { gradientStyle, isDark, isLoading } = useGradient();
  const [floatImage, setFloatImage] = useState('/images/auto/cars/Car_1.png');

  useEffect(() => {
    console.log('Float Current LOB:', lob); // Debug log
    
    // Get all available float images for the selected LOB
    const getFloatImages = () => {
      const autoImages = [
        '/images/auto/cars/Car_1.png',
        '/images/auto/cars/Car_2.png',
        '/images/auto/cars/Car_3.png',
        '/images/auto/cars/Car_4.png',
        '/images/auto/cars/Car_5.png',
        '/images/auto/cars/Car_6.png',
        '/images/auto/cars/Car_7.png',
        '/images/auto/cars/Car_8.png',
        '/images/auto/cars/Car_9.png',
        '/images/auto/cars/Car_10.png'
      ];

      const healthImages = [
        '/images/health/medicine/Medicine_01.png',
        '/images/health/medicine/Medicine_02.png',
        '/images/health/medicine/Medicine_03.png',
        '/images/health/medicine/Medicine_04.png',
        '/images/health/medicine/Medicine_05.png',
        '/images/health/medicine/Medicine_06.png'
      ];

      // Return images based on LOB
      console.log('Float selecting images for LOB:', lob.toLowerCase());
      
      switch(lob.toLowerCase()) {
        case 'auto':
          console.log('Selected auto images');
          return autoImages;
        case 'health':
          console.log('Selected health images');
          return healthImages;
        default:
          console.log('Selected default (auto) images');
          return autoImages;
      }
    };

    // Get random float image from the available ones
    const images = getFloatImages();
    const randomImage = images[Math.floor(Math.random() * images.length)];
    console.log('Selected random float image:', randomImage);
    setFloatImage(randomImage);
  }, [lob]);

  if (isLoading) {
    return <div className="w-[500px] h-[500px] animate-pulse bg-gray-200 rounded-lg" />;
  }

  return (
    <div style={gradientStyle} className="relative w-[500px] h-[500px] rounded-2xl overflow-hidden">
      {/* Grid Container */}
      <div className="h-full grid grid-rows-2">
        {/* Top Grid - Logo, Title, Subtitle */}
        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo 
              isDark={isDark} 
              width={80} 
              height={24}
            />
          </div>
          
          {/* Text Content - Positioned to work with floating image */}
          <div className="relative z-20 mt-10 max-w-[90%]">
            <div className="max-w-[85%]">
              <BannerText 
                as="h2"
                weight="semibold"
                className={`text-[36px] leading-tight mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                {title}
              </BannerText>
            </div>
            {subtitle && (
              <BannerText 
                as="p"
                weight="regular"
                className={`text-[18px] leading-relaxed ${isDark ? 'text-white/90' : 'text-gray-600'}`}
              >
                {subtitle}
              </BannerText>
            )}
          </div>
        </div>

        {/* Bottom Grid Container */}
        <div className="grid grid-cols-2">
          {/* Bottom Left - CTA */}
          <div className="flex items-center justify-center p-8">
            <CTAButton 
              text={cta}
              className="w-[220px] h-[45px] !text-[16px] whitespace-nowrap"
            />
          </div>

          {/* Bottom Right - Image */}
          <div className="relative overflow-hidden">
            <div className="absolute right-[-45%] top-[-40%] w-[150%] h-[150%]">
              <Image
                src={floatImage}
                alt={lob === 'auto' ? "Car" : "Medicine"}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 

// Instagram Square with Character (1080x1080)
export function InstagramSquare1080Character({ logo, title, subtitle, cta, lob = 'auto' }: BannerProps & { lob?: string }) {
  const { gradientStyle, isDark, isLoading } = useGradient();
  const [characterImage, setCharacterImage] = useState('/images/auto/character/character1.png');

  useEffect(() => {
    console.log('Current LOB:', lob); // Debug log for current LOB
    
    // Get all available character images for the selected LOB
    const getCharacterImages = () => {
      const autoCharacters = [
        '/images/auto/character/character1.png',
        '/images/auto/character/character2.png',
        '/images/auto/character/character3.png',
        '/images/auto/character/character4.png',
        '/images/auto/character/character5.png',
        '/images/auto/character/character6.png',
        '/images/auto/character/character7.png'
      ];

      const healthCharacters = [
        '/images/health/characters/character1.png',
        '/images/health/characters/character2.png',
        '/images/health/characters/character3.png',
        '/images/health/characters/character4.png',
        '/images/health/characters/character5.png',
        '/images/health/characters/character6.png',
        '/images/health/characters/character7.png'
      ];

      // Return images based on LOB
      console.log('Selecting images for LOB:', lob.toLowerCase()); // Debug log for LOB being used in switch
      
      switch(lob.toLowerCase()) {
        case 'auto':
          console.log('Selected auto characters'); // Debug log for auto selection
          return autoCharacters;
        case 'health':
          console.log('Selected health characters'); // Debug log for health selection
          return healthCharacters;
        case 'life':
          console.log('Selected life character'); // Debug log for life selection
          return ['/images/life/character/character1.png']; // Placeholder for life
        case 'ackodrive':
          console.log('Selected ackodrive character'); // Debug log for ackodrive selection
          return ['/images/ackodrive/character/character1.png']; // Placeholder for ackodrive
        default:
          console.log('Selected default (auto) characters'); // Debug log for default case
          return autoCharacters;
      }
    };

    // Get random character image from the available ones
    const images = getCharacterImages();
    const randomImage = images[Math.floor(Math.random() * images.length)];
    console.log('Selected random image:', randomImage); // Debug log for selected image
    setCharacterImage(randomImage);
  }, [lob]);

  if (isLoading) {
    return <div className="w-[500px] h-[500px] animate-pulse bg-gray-200 rounded-lg" />;
  }

  return (
    <div style={gradientStyle} className="relative w-[500px] h-[500px] rounded-2xl overflow-hidden">
      {/* Grid Container */}
      <div className="h-full grid grid-rows-2">
        {/* Top Grid - Logo, Title, Subtitle */}
        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo 
              isDark={isDark} 
              width={80} 
              height={24}
            />
          </div>
          
          {/* Title and Subtitle */}
          <div className="max-w-[80%]">
            <BannerText 
              as="h2"
              weight="semibold"
              className={`text-[36px] leading-tight mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              {title}
            </BannerText>
            {subtitle && (
              <BannerText 
                as="p"
                weight="regular"
                className={`text-[18px] leading-relaxed ${isDark ? 'text-white/90' : 'text-gray-600'}`}
              >
                {subtitle}
              </BannerText>
            )}
          </div>
        </div>

        {/* Bottom Grid Container */}
        <div className="grid grid-cols-2">
          {/* Bottom Left - CTA */}
          <div className="flex items-center justify-center p-8">
            <CTAButton 
              text={cta}
              className="w-[220px] h-[45px] !text-[16px] whitespace-nowrap"
            />
          </div>

          {/* Bottom Right - Image */}
          <div className="relative overflow-hidden">
            <div className="absolute right-[-35%] top-[-03%] w-[140%] h-[140%]">
              <Image
                src={characterImage}
                alt="Character"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 

const PROFILE_IMAGES = [
  {
    image: "/images/profile/man1.jpg",
    name: "Arjun Patel",
    role: "Product Design Lead",
    testimonial: "The AI-powered features have completely transformed our workflow. The automation saves hours of manual tasks. The interface is incredibly intuitive to use. Our team productivity has increased significantly."
  },
  {
    image: "/images/profile/man2.jpg",
    name: "Vikram Mehta",
    role: "Senior UX Designer",
    testimonial: "I was skeptical at first about the AI capabilities. But the smart suggestions are incredibly accurate. The automated workflows save us so much time. The results have exceeded all our expectations."
  }
];

// Instagram Square with Testimonial (1080x1080)
export function InstagramSquare1080Testimonial({ 
  logo, 
  title, 
  subtitle, 
  cta,
  customer
}: BannerProps & { customer?: { name: string; role: string; image: string } }) {
  const { gradientStyle, isDark, isLoading } = useGradient();
  
  // Select random profile if customer is not provided
  const randomProfile = PROFILE_IMAGES[Math.floor(Math.random() * PROFILE_IMAGES.length)];
  const profileData = customer || randomProfile;

  if (isLoading) {
    return <div className="w-[500px] h-[500px] animate-pulse bg-gray-200 rounded-lg" />;
  }

  return (
    <div style={gradientStyle} className="relative w-[500px] h-[500px] rounded-2xl overflow-hidden">
      <div className="h-full flex flex-col items-center p-8">
        {/* Logo */}
        <Logo 
          isDark={isDark} 
          width={80} 
          height={24}
          className="mb-8"
        />
        
        {/* Testimonial Text with Chat Bubble */}
        <div className="max-w-[90%] mb-8">
          {/* Chat Bubble Container */}
          <div className={`
            p-7
            rounded-[24px] 
            ${isDark ? 'bg-white/10' : 'bg-black/5'}
          `}>
            <BannerText 
              as="p"
              weight="medium"
              className={`text-[28px] leading-[1.4] line-clamp-4 ${isDark ? 'text-white/90' : 'text-gray-600'}`}
            >
              &ldquo;{subtitle}&rdquo;
            </BannerText>
          </div>
        </div>

        {/* Customer Info with Profile Picture */}
        <div className="flex items-center gap-3 mb-6">
          {/* Profile Picture with rounded corners */}
          <div className="relative w-[48px] h-[48px] rounded-[12px] overflow-hidden border-2 border-white/20">
            <Image
              src={profileData.image}
              alt={profileData.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Name and Role */}
          <div>
            <BannerText 
              as="h3"
              weight="semibold"
              className={`text-[18px] mb-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              {profileData.name}
            </BannerText>
            <BannerText 
              as="p"
              weight="regular"
              className={`text-[14px] ${isDark ? 'text-white/70' : 'text-gray-600'}`}
            >
              {profileData.role}
            </BannerText>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-auto">
          <CTAButton 
            text={cta}
            className="w-[220px] h-[45px] !text-[16px] whitespace-nowrap"
          />
        </div>
      </div>
    </div>
  );
} 

// Instagram Square with Background (1080x1080)
export function InstagramSquare1080Background({ logo, title, subtitle, cta, lob = 'auto' }: BannerProps & { lob?: string }) {
  const { isDark, isLoading } = useGradient();
  const [backgroundImage, setBackgroundImage] = useState('/images/auto/background/background_1.png');

  useEffect(() => {
    console.log('Background Current LOB:', lob); // Debug log
    
    // Get all available background images for the selected LOB
    const getBackgroundImages = () => {
      const autoBackgrounds = [
        '/images/auto/background/background_1.png',
        '/images/auto/background/background_2.png',
        '/images/auto/background/background_3.png',
        '/images/auto/background/background_4.png'
      ];

      const healthBackgrounds = [
        '/images/health/background/Background_1.png',
        '/images/health/background/Background_2.png'
      ];

      // Return images based on LOB
      console.log('Background selecting images for LOB:', lob.toLowerCase());
      
      switch(lob.toLowerCase()) {
        case 'auto':
          console.log('Selected auto backgrounds');
          return autoBackgrounds;
        case 'health':
          console.log('Selected health backgrounds');
          return healthBackgrounds;
        default:
          console.log('Selected default (auto) backgrounds');
          return autoBackgrounds;
      }
    };

    // Get random background image from the available ones
    const images = getBackgroundImages();
    const randomImage = images[Math.floor(Math.random() * images.length)];
    console.log('Selected random background:', randomImage);
    setBackgroundImage(randomImage);
  }, [lob]);

  if (isLoading) {
    return <div className="w-[500px] h-[500px] animate-pulse bg-gray-200 rounded-lg" />;
  }

  return (
    <div className="relative w-[500px] h-[500px] rounded-2xl overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt={`${lob.toUpperCase()} Background`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" /> {/* Dark overlay for better text contrast */}
      </div>

      {/* Content Container */}
      <div className="relative h-full z-10 flex flex-col p-8">
        {/* Logo Section */}
        <div>
          <Logo 
            isDark={true} 
            width={80} 
            height={24}
          />
        </div>

        {/* Text Content - Centered */}
        <div className="flex-1 flex flex-col justify-center max-w-[400px]">
          <BannerText 
            as="h2"
            weight="semibold"
            className="text-[42px] leading-tight mb-4 text-white"
          >
            {title}
          </BannerText>
          {subtitle && (
            <BannerText 
              as="p"
              weight="regular"
              className="text-[20px] leading-relaxed text-white/90"
            >
              {subtitle}
            </BannerText>
          )}
        </div>

        {/* CTA Button */}
        <div className="w-[200px]">
          <CTAButton 
            text={cta}
            className="w-[220px] h-[45px] !text-[16px] !bg-white !text-gray-900 whitespace-nowrap"
          />
        </div>
      </div>
    </div>
  );
} 

// Comparison Banner (1080x1080)
interface ComparisonData {
  title: string;
  features: string[];
  image: string;
}

interface ComparisonBannerProps extends BannerProps {
  before: ComparisonData;
  after: ComparisonData;
}

export function ComparisonBanner1080({ 
  logo, 
  cta,
  before = {
    title: "Without AI",
    features: [
      "Manual data entry",
      "Hours of paperwork",
      "Prone to errors"
    ],
    image: "/images/comparison/before.png"
  },
  after = {
    title: "With AI",
    features: [
      "Automated data capture",
      "Instant processing",
      "99.9% accuracy"
    ],
    image: "/images/comparison/after.png"
  }
}: ComparisonBannerProps) {
  const { gradientStyle, isDark, isLoading } = useGradient();

  if (isLoading) {
    return <div className="w-[500px] h-[500px] animate-pulse bg-gray-200 rounded-lg" />;
  }

  return (
    <div style={gradientStyle} className="relative w-[500px] h-[500px] rounded-2xl overflow-hidden">
      <div className="h-full flex flex-col p-8">
        {/* Logo */}
        <Logo 
          isDark={isDark} 
          width={80} 
          height={24}
          className="mb-8"
        />
        
        {/* Comparison Container */}
        <div className="flex gap-6 mb-8">
          {/* Before Side */}
          <div className="flex-1">
            <div className={`
              p-4 
              rounded-2xl 
              ${isDark ? 'bg-white/10' : 'bg-black/5'}
            `}>
              {/* Title */}
              <BannerText 
                as="h3"
                weight="semibold"
                className={`text-[20px] mb-4 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                {before.title}
              </BannerText>

              {/* Image */}
              <div className="relative w-full h-[160px] mb-4 rounded-xl overflow-hidden">
                <Image
                  src={before.image}
                  alt={before.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Features */}
              <ul className="space-y-2">
                {before.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white/60' : 'bg-gray-600'}`} />
                    <BannerText 
                      weight="regular"
                      className={`text-[14px] ${isDark ? 'text-white/80' : 'text-gray-600'}`}
                    >
                      {feature}
                    </BannerText>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* After Side */}
          <div className="flex-1">
            <div className={`
              p-4 
              rounded-2xl 
              ${isDark ? 'bg-white/10' : 'bg-black/5'}
            `}>
              {/* Title */}
              <BannerText 
                as="h3"
                weight="semibold"
                className={`text-[20px] mb-4 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                {after.title}
              </BannerText>

              {/* Image */}
              <div className="relative w-full h-[160px] mb-4 rounded-xl overflow-hidden">
                <Image
                  src={after.image}
                  alt={after.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Features */}
              <ul className="space-y-2">
                {after.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white/60' : 'bg-gray-600'}`} />
                    <BannerText 
                      weight="regular"
                      className={`text-[14px] ${isDark ? 'text-white/80' : 'text-gray-600'}`}
                    >
                      {feature}
                    </BannerText>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-auto">
          <CTAButton 
            text={cta}
            className="w-full h-[45px] !text-[16px] !px-8"
          />
        </div>
      </div>
    </div>
  );
} 

// Feature Matrix Banner (1080x1080)
interface FeatureData {
  title: string;
  price: string;
  features: Array<{
    name: string;
    included: boolean;
  }>;
}

interface FeatureMatrixProps extends BannerProps {
  basic: FeatureData;
  pro: FeatureData;
}

export function FeatureMatrixBanner1080({ 
  logo, 
  cta,
  basic = {
    title: "Basic Plan",
    price: "$29/mo",
    features: [
      { name: "Basic AI features", included: true },
      { name: "Standard support", included: true },
      { name: "Up to 100 queries/mo", included: true },
      { name: "Advanced analytics", included: false },
      { name: "Custom training", included: false }
    ]
  },
  pro = {
    title: "Pro Plan",
    price: "$99/mo",
    features: [
      { name: "Basic AI features", included: true },
      { name: "Priority support", included: true },
      { name: "Unlimited queries", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Custom training", included: true }
    ]
  }
}: FeatureMatrixProps) {
  const { gradientStyle, isDark, isLoading } = useGradient();

  if (isLoading) {
    return <div className="w-[500px] h-[500px] animate-pulse bg-gray-200 rounded-lg" />;
  }

  return (
    <div style={gradientStyle} className="relative w-[500px] h-[500px] rounded-2xl overflow-hidden">
      <div className="h-full flex flex-col p-8">
        {/* Logo */}
        <Logo 
          isDark={isDark} 
          width={80} 
          height={24}
          className="mb-8"
        />
        
        {/* Feature Matrix Container */}
        <div className="flex flex-1 mb-8">
          {/* Basic Column */}
          <div className="flex-1 pr-6 border-r border-white/20">
            {/* Title */}
            <BannerText 
              as="h3"
              weight="semibold"
              className={`text-[24px] mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              {basic.title}
            </BannerText>

            {/* Price */}
            <BannerText 
              as="p"
              weight="medium"
              className={`text-[32px] mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              {basic.price}
            </BannerText>

            {/* Features */}
            <ul className="space-y-4">
              {basic.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center
                    ${feature.included 
                      ? (isDark ? 'bg-white/20' : 'bg-black/10')
                      : 'bg-transparent'
                    }
                  `}>
                    {feature.included && (
                      <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-white' : 'bg-gray-900'}`} />
                    )}
                  </div>
                  <BannerText 
                    weight="regular"
                    className={`text-[16px] ${isDark 
                      ? (feature.included ? 'text-white' : 'text-white/40')
                      : (feature.included ? 'text-gray-900' : 'text-gray-400')
                    }`}
                  >
                    {feature.name}
                  </BannerText>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Column */}
          <div className="flex-1 pl-6">
            {/* Title */}
            <BannerText 
              as="h3"
              weight="semibold"
              className={`text-[24px] mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              {pro.title}
            </BannerText>

            {/* Price */}
            <BannerText 
              as="p"
              weight="medium"
              className={`text-[32px] mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              {pro.price}
            </BannerText>

            {/* Features */}
            <ul className="space-y-4">
              {pro.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center
                    ${feature.included 
                      ? (isDark ? 'bg-white/20' : 'bg-black/10')
                      : 'bg-transparent'
                    }
                  `}>
                    {feature.included && (
                      <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-white' : 'bg-gray-900'}`} />
                    )}
                  </div>
                  <BannerText 
                    weight="regular"
                    className={`text-[16px] ${isDark 
                      ? (feature.included ? 'text-white' : 'text-white/40')
                      : (feature.included ? 'text-gray-900' : 'text-gray-400')
                    }`}
                  >
                    {feature.name}
                  </BannerText>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-auto">
          <CTAButton 
            text={cta}
            className="w-full h-[45px] !text-[16px] !px-8"
          />
        </div>
      </div>
    </div>
  );
} 

// Add this near the top with other interfaces
interface BannerCopy {
  title: string;
  subtitle: string;
  cta: string;
}

// Add this utility function
async function generateBannerCopy(prompt: string): Promise<BannerCopy> {
  try {
    const response = await fetch('/api/generate-copy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt })
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate copy');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating copy:', error);
    return {
      title: 'Experience the Future Today',
      subtitle: 'Transform your workflow with AI-powered automation',
      cta: 'Get Started'
    };
  }
} 

// Add this new component
export function BannerGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [bannerCopy, setBannerCopy] = useState<BannerCopy>({
    title: '',
    subtitle: '',
    cta: ''
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const copy = await generateBannerCopy(prompt);
      setBannerCopy(copy);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Prompt Input Section */}
      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt to generate banner copy..."
          className="w-full p-4 rounded-lg border border-gray-300 min-h-[100px]"
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`px-6 py-2 rounded-full bg-blue-500 text-white ${
            isGenerating ? 'opacity-50' : 'hover:bg-blue-600'
          }`}
        >
          {isGenerating ? 'Generating...' : 'Generate Banners'}
        </button>
      </div>

      {/* Generated Banners Section */}
      {bannerCopy.title && (
        <div className="space-y-8">
          <Leaderboard728x90
            title={bannerCopy.title}
            subtitle={bannerCopy.subtitle}
            cta={bannerCopy.cta}
          />
          
          <Rectangle300x250
            title={bannerCopy.title}
            subtitle={bannerCopy.subtitle}
            cta={bannerCopy.cta}
          />
          
          <Skyscraper160x600
            title={bannerCopy.title}
            subtitle={bannerCopy.subtitle}
            cta={bannerCopy.cta}
          />
          
          {/* Add other banner formats as needed */}
        </div>
      )}
    </div>
  );
} 