'use client'

import { useState, useEffect } from 'react'
import * as htmlToImage from 'html-to-image'
import {
  InstagramSquare1080,
  InstagramSquare1080Flipped,
  InstagramSquare1080Float,
  InstagramSquare1080Character,
  InstagramSquare1080Background
} from '../../components/Banner/GoogleBanners'
import type { ReactNode } from 'react'
import Image from 'next/image'
import { CustomDropdown } from '../../components/ui/CustomDropdown'
import { SkeletonCard } from '../../components/ui/SkeletonCard'
import { generateOptimalColorSet, createColorVariation, generateFastRemixColorSet } from '../../utils/smartColorSelection'


// Define banner types based on the API response
type ComparisonPoints = {
  us: string[]
  them: string[]
}

type BannerContent = {
  headline: string | React.ReactNode
  description: string | React.ReactNode
  ctaText: string | React.ReactNode
  comparisonPoints?: ComparisonPoints
}

type BannerDesign = {
  template: 'comparison' | 'standard' | 'testimonial'
  layout: string
  colors: Record<string, string>
}

type Banner = {
  design: BannerDesign
  content: BannerContent
}

type BannerResponse = {
  banners: Banner[]
}




// Add delay between updates
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}





type SelectedBanner = {
  component: ReactNode
  title: string
  bannerData?: Banner
  templateIndex?: number
}


// Add confetti styles
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes scaleIn {
    from { 
      opacity: 0;
      transform: scale(0.95);
    }
    to { 
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes scaleOut {
    from { 
      opacity: 1;
      transform: scale(1);
    }
    to { 
      opacity: 0;
      transform: scale(0.95);
    }
  }

  @keyframes gradientFlow {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes heartBeat {
    0% {
      transform: scale(1);
    }
    25% {
      transform: scale(1.1);
    }
    40% {
      transform: scale(1);
    }
    60% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out forwards;
  }

  .animate-fadeOut {
    animation: fadeOut 0.2s ease-out forwards;
  }

  .animate-scaleIn {
    animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .animate-scaleOut {
    animation: scaleOut 0.2s ease-out forwards;
  }

  .animate-gradient {
    background-size: 200% 200%;
    animation: gradientFlow 3s linear infinite;
  }

  .animate-heart {
    display: inline-block;
    animation: heartBeat 1s ease-in-out infinite;
    transform-origin: center;
  }
`




export default function ChatInterface() {
  // Move these inside the component
  const [isClosing, setIsClosing] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState<SelectedBanner | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [bannerOrder, setBannerOrder] = useState<number[]>([0, 1, 2, 3, 4]);
  const [lob, setLob] = useState('auto');
  const [selectedLOB, setSelectedLOB] = useState('auto');

  // Update selectedLOB when lob changes
  useEffect(() => {
    setSelectedLOB(lob);
  }, [lob]);

  // Move handleClose inside the component
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsModalOpen(false)
      setIsClosing(false)
      setModalPreviewStyles(null) // Reset modal preview when closing
    }, 200)
  }

  const [input, setInput] = useState('')
  const [language, setLanguage] = useState('english')
  const [theme, setTheme] = useState('fomo')
  const [response, setResponse] = useState<BannerResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [bannerStyles, setBannerStyles] = useState<{[key: number]: {
    image?: string;
    gradient?: { background: string };
    ctaColor?: string;
    textColor?: string;
    headingColor?: string;
    ctaTextColor?: string;
  }}>({})

  // Separate state for modal preview (temporary remix changes)
  const [modalPreviewStyles, setModalPreviewStyles] = useState<{
    image?: string;
    gradient?: { background: string };
    ctaColor?: string;
    textColor?: string;
    headingColor?: string;
    ctaTextColor?: string;
  } | null>(null)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setIsStreaming(true)
    
    // Clear previous response to prevent memory accumulation
    setResponse(null)
    
    // Clear previous banner styles
    setBannerStyles({})
    
    // Shuffle banner order
    const newOrder = [...bannerOrder].sort(() => Math.random() - 0.5);
    setBannerOrder(newOrder);
    
    setResponse({ 
      banners: [
        {
          design: {
            template: 'standard',
            layout: 'center',
            colors: {
              background: '#f0f8ff',
              text: '#000000',
              cta: '#ff4500'
            }
          },
          content: {
            headline: "Generating your headline...",
            description: "Creating the perfect description for your needs...",
            ctaText: "Loading..."
          }
        },
        {
          design: {
            template: 'standard',
            layout: 'center',
            colors: {
              background: '#f0f8ff',
              text: '#000000',
              cta: '#ff4500'
            }
          },
          content: {
            headline: "Generating your headline...",
            description: "Creating the perfect description for your needs...",
            ctaText: "Loading..."
          }
        },
        {
          design: {
            template: 'standard',
            layout: 'center',
            colors: {
              background: '#f0f8ff',
              text: '#000000',
              cta: '#ff4500'
            }
          },
          content: {
            headline: "Generating your headline...",
            description: "Creating the perfect description for your needs...",
            ctaText: "Loading..."
          }
        },
        {
          design: {
            template: 'standard',
            layout: 'center',
            colors: {
              background: '#f0f8ff',
              text: '#000000',
              cta: '#ff4500'
            }
          },
          content: {
            headline: "Generating your headline...",
            description: "Creating the perfect description for your needs...",
            ctaText: "Loading..."
          }
        },
        {
          design: {
            template: 'standard',
            layout: 'center',
            colors: {
              background: '#f0f8ff',
              text: '#000000',
              cta: '#ff4500'
            }
          },
          content: {
            headline: "Generating your headline...",
            description: "Creating the perfect description for your needs...",
            ctaText: "Loading..."
          }
        }
      ]
    })
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, language, theme, lob }),
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json() as BannerResponse
      await delay(500) // Small delay for better UX
      setResponse(data)
      
      // Generate and store images for each banner template that needs them
      generateBannerImages()
    } catch (error) {
      console.error('Error:', error)
      
      // Fallback with mock data for development
      setResponse({
        banners: [
          {
            design: {
              template: 'standard',
              layout: 'center',
              colors: {
                background: '#3B82F6',
                text: '#FFFFFF',
                cta: '#10B981'
              }
            },
            content: {
              headline: `Get the Best ${lob} Insurance Today!`,
              description: `Experience premium ${lob} coverage with unmatched benefits and instant quotes.`,
              ctaText: 'Get Quote Now'
            }
          },
          {
            design: {
              template: 'comparison',
              layout: 'center',
              colors: {
                background: '#EF4444',
                text: '#FFFFFF',
                cta: '#F59E0B'
              }
            },
            content: {
              headline: `Why Choose Our ${lob} Insurance?`,
              description: 'See how we compare to traditional insurance providers.',
              ctaText: 'Compare Now',
              comparisonPoints: {
                us: ['Instant Claims', '24/7 Support', 'No Paperwork'],
                them: ['Slow Claims', 'Limited Hours', 'Heavy Paperwork']
              }
            }
          }
        ]
      })
      
      // Generate and store images for fallback banners too
      generateBannerImages()
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
    }
  }

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'tamil', label: 'Tamil' },
    { value: 'kannada', label: 'Kannada' },
    { value: 'telugu', label: 'Telugu' },
    { value: 'marathi', label: 'Marathi' }
  ];

  const themeOptions = [
    { value: 'fomo', label: 'Fomo' },
    { value: 'urgency', label: 'Urgency' },
    { value: 'exclusivity', label: 'Exclusivity' },
    { value: 'value', label: 'Value' },
    { value: 'trust', label: 'Trust' },
    { value: 'community', label: 'Community' }
  ];

  const lobOptions = [
    { value: 'auto', label: 'Auto' },
    { value: 'health', label: 'Health' }
  ];


  // Add this in your ChatInterface component before the return statement
  useEffect(() => {
    // Inject styles
    const styleSheet = document.createElement("style")
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)
    return () => styleSheet.remove()
  }, [])

  // Add this function inside ChatInterface component
  const handleDownload = async () => {
    if (selectedBanner?.component) {
      const modalContent = document.querySelector('.modal-content') as HTMLElement
      if (modalContent) {
        try {
          // Wait for fonts to be fully loaded
          await document.fonts.ready
          
          // Longer delay to ensure layout is completely stable
          await new Promise(resolve => setTimeout(resolve, 300))
          
          const dataUrl = await htmlToImage.toPng(modalContent, {
            quality: 1.0,
            pixelRatio: 1,
            style: {
              transform: 'translateY(-8px)', // Compensate for capture offset
              transformOrigin: 'top left',
            }
          })
          const link = document.createElement('a')
          link.download = `${selectedBanner.title.toLowerCase().replace(/\s+/g, '-')}.png`
          link.href = dataUrl
          link.click()
        } catch (error) {
          console.error('Error downloading banner:', error)
        }
      }
    }
  }

  const renderContent = (content: React.ReactNode | string) => {
    return typeof content === 'string' ? content : content;
  };

  // Generate and store images for all banners once
  const generateBannerImages = () => {
    const autoImages = {
      full: ['/images/auto/full/full_1.png', '/images/auto/full/full_2.png'],
      float: ['/images/auto/cars/Car_1.png', '/images/auto/cars/Car_2.png', '/images/auto/cars/Car_3.png', '/images/auto/cars/Car_4.png', '/images/auto/cars/Car_5.png', '/images/auto/cars/Car_6.png', '/images/auto/cars/Car_7.png', '/images/auto/cars/Car_8.png', '/images/auto/cars/Car_9.png', '/images/auto/cars/Car_10.png'],
      character: ['/images/auto/character/character1.png', '/images/auto/character/character2.png', '/images/auto/character/character3.png', '/images/auto/character/character4.png', '/images/auto/character/character5.png', '/images/auto/character/character6.png', '/images/auto/character/character7.png'],
      background: ['/images/auto/background/background_1.png', '/images/auto/background/background_2.png', '/images/auto/background/background_3.png', '/images/auto/background/background_4.png']
    };
    
    const healthImages = {
      full: ['/images/health/full/full_1.png', '/images/health/full/Full_2.png', '/images/health/full/Full_3.png', '/images/health/full/Full_4.png'],
      float: ['/images/health/medicine/Medicine_01.png', '/images/health/medicine/Medicine_02.png', '/images/health/medicine/Medicine_03.png', '/images/health/medicine/Medicine_04.png', '/images/health/medicine/Medicine_05.png', '/images/health/medicine/Medicine_06.png'],
      character: ['/images/health/characters/character1.png', '/images/health/characters/character2.png', '/images/health/characters/character3.png', '/images/health/characters/character4.png', '/images/health/characters/character5.png', '/images/health/characters/character6.png', '/images/health/characters/character7.png'],
      background: ['/images/health/background/Background_1.png', '/images/health/background/Background_2.png']
    };

    const imageMap = selectedLOB.toLowerCase() === 'health' ? healthImages : autoImages;
    const newBannerStyles: {[key: number]: {
      image?: string;
      gradient?: { background: string };
      ctaColor?: string;
      textColor?: string;
      headingColor?: string;
      ctaTextColor?: string;
    }} = {};
    
    // Generate images and intelligent color combinations for all 5 banners (0-4)
    for (let i = 0; i < 5; i++) {
      const templateIndex = i % 5;
      
      // Generate optimal color set with accessibility compliance
      const colorSet = generateOptimalColorSet();
      
      // Template 0 = Standard (full), Template 1 = Flipped (full), Template 2 = Float, Template 3 = Character, Template 4 = Background
      if (templateIndex === 0 || templateIndex === 1) {
        const images = imageMap.full;
        newBannerStyles[i] = { 
          image: images[Math.floor(Math.random() * images.length)],
          gradient: { background: colorSet.gradient },
          ctaColor: colorSet.ctaColor,
          textColor: colorSet.textColor,
          headingColor: colorSet.headingColor,
          ctaTextColor: colorSet.contrastRatios.ctaTextToCta
        };
      } else if (templateIndex === 2) {
        const images = imageMap.float;
        newBannerStyles[i] = { 
          image: images[Math.floor(Math.random() * images.length)],
          gradient: { background: colorSet.gradient },
          ctaColor: colorSet.ctaColor,
          textColor: colorSet.textColor,
          headingColor: colorSet.headingColor,
          ctaTextColor: colorSet.contrastRatios.ctaTextToCta
        };
      } else if (templateIndex === 3) {
        const images = imageMap.character;
        newBannerStyles[i] = { 
          image: images[Math.floor(Math.random() * images.length)],
          gradient: { background: colorSet.gradient },
          ctaColor: colorSet.ctaColor,
          textColor: colorSet.textColor,
          headingColor: colorSet.headingColor,
          ctaTextColor: colorSet.contrastRatios.ctaTextToCta
        };
      } else if (templateIndex === 4) {
        const images = imageMap.background;
        newBannerStyles[i] = { 
          image: images[Math.floor(Math.random() * images.length)],
          gradient: { background: colorSet.gradient },
          ctaColor: colorSet.ctaColor,
          textColor: colorSet.textColor,
          headingColor: colorSet.headingColor,
          ctaTextColor: colorSet.contrastRatios.ctaTextToCta
        };
      }
    }
    
    setBannerStyles(newBannerStyles);
  };

  // Render one banner per content variation
  const renderSingleBanner = (banner: Banner, index: number) => {
    // Choose different template for each banner to add variety
    const templates = [
      InstagramSquare1080,
      InstagramSquare1080Flipped, 
      InstagramSquare1080Float,
      InstagramSquare1080Character,
      InstagramSquare1080Background
    ];
    
    const templateNames = [
      'Standard Instagram Banner',
      'Flipped Instagram Banner', 
      'Float Instagram Banner',
      'Character Instagram Banner',
      'Background Instagram Banner'
    ];
    
    const SelectedTemplate = templates[index % templates.length];
    const templateName = templateNames[index % templateNames.length];
    const templateIndex = index % templates.length;
    
    // Use stored styles for this banner (image, gradient, CTA color, text colors)
    const selectedImage = bannerStyles[index]?.image;
    const selectedGradient = bannerStyles[index]?.gradient;
    const selectedCtaColor = bannerStyles[index]?.ctaColor;
    const selectedTextColor = bannerStyles[index]?.textColor;
    const selectedHeadingColor = bannerStyles[index]?.headingColor;
    const selectedCtaTextColor = bannerStyles[index]?.ctaTextColor;
    
    return (
      <div className="w-full flex justify-center" key={`banner-${index}`}>
        <div 
          className="transform scale-90 origin-center cursor-pointer hover:opacity-95 transition-all duration-300 hover:scale-95 hover:shadow-2xl rounded-2xl overflow-hidden" 
          onClick={() => {
            // Create an identical component for the modal with same styles
            const modalComponent = (
              <SelectedTemplate
                title={renderContent(banner.content.headline)}
                subtitle={renderContent(banner.content.description)}
                cta={renderContent(banner.content.ctaText)}
                lob={selectedLOB}
                selectedImage={selectedImage}
                selectedGradient={selectedGradient}
                selectedCtaColor={selectedCtaColor}
                selectedTextColor={selectedTextColor}
                selectedHeadingColor={selectedHeadingColor}
                selectedCtaTextColor={selectedCtaTextColor}
              />
            );
            
            setSelectedBanner({ 
              component: modalComponent, 
              title: templateName,
              templateIndex: index
            });
            setModalPreviewStyles(null); // Reset modal preview when opening new banner
            setIsModalOpen(true);
          }}
        >
          <SelectedTemplate
            title={renderContent(banner.content.headline)}
            subtitle={renderContent(banner.content.description)}
            cta={renderContent(banner.content.ctaText)}
            lob={selectedLOB}
            selectedImage={selectedImage}
            selectedGradient={selectedGradient}
            selectedCtaColor={selectedCtaColor}
            selectedTextColor={selectedTextColor}
            selectedHeadingColor={selectedHeadingColor}
            selectedCtaTextColor={selectedCtaTextColor}
          />
        </div>
      </div>
    );
  };

  // Remix function to randomize image, background gradient, and CTA color for selected banner
  const handleRemix = () => {
    if (selectedBanner && selectedBanner.templateIndex !== undefined) {
      const index = selectedBanner.templateIndex;
      const templateIndex = index % 5;
      
      // Get the template components and names
      const templates = [
        InstagramSquare1080,
        InstagramSquare1080Flipped, 
        InstagramSquare1080Float,
        InstagramSquare1080Character,
        InstagramSquare1080Background
      ];
      const templateNames = [
        'Standard Instagram Banner',
        'Flipped Instagram Banner', 
        'Float Instagram Banner',
        'Character Instagram Banner',
        'Background Instagram Banner'
      ];
      
      const SelectedTemplate = templates[templateIndex];
      const templateName = templateNames[templateIndex];
      
      // Get image map for current LOB
      const autoImages = {
        full: ['/images/auto/full/full_1.png', '/images/auto/full/full_2.png'],
        float: ['/images/auto/cars/Car_1.png', '/images/auto/cars/Car_2.png', '/images/auto/cars/Car_3.png', '/images/auto/cars/Car_4.png', '/images/auto/cars/Car_5.png', '/images/auto/cars/Car_6.png', '/images/auto/cars/Car_7.png', '/images/auto/cars/Car_8.png', '/images/auto/cars/Car_9.png', '/images/auto/cars/Car_10.png'],
        character: ['/images/auto/character/character1.png', '/images/auto/character/character2.png', '/images/auto/character/character3.png', '/images/auto/character/character4.png', '/images/auto/character/character5.png', '/images/auto/character/character6.png', '/images/auto/character/character7.png'],
        background: ['/images/auto/background/background_1.png', '/images/auto/background/background_2.png', '/images/auto/background/background_3.png', '/images/auto/background/background_4.png']
      };
      
      const healthImages = {
        full: ['/images/health/full/full_1.png', '/images/health/full/Full_2.png', '/images/health/full/Full_3.png', '/images/health/full/Full_4.png'],
        float: ['/images/health/medicine/Medicine_01.png', '/images/health/medicine/Medicine_02.png', '/images/health/medicine/Medicine_03.png', '/images/health/medicine/Medicine_04.png', '/images/health/medicine/Medicine_05.png', '/images/health/medicine/Medicine_06.png'],
        character: ['/images/health/characters/character1.png', '/images/health/characters/character2.png', '/images/health/characters/character3.png', '/images/health/characters/character4.png', '/images/health/characters/character5.png', '/images/health/characters/character6.png', '/images/health/characters/character7.png'],
        background: ['/images/health/background/Background_1.png', '/images/health/background/Background_2.png']
      };
      
      const imageMap = selectedLOB.toLowerCase() === 'health' ? healthImages : autoImages;
      
      // Generate new image selection
      let newImage = '';
      if (templateIndex === 0 || templateIndex === 1) {
        const images = imageMap.full;
        newImage = images[Math.floor(Math.random() * images.length)];
      } else if (templateIndex === 2) {
        const images = imageMap.float;
        newImage = images[Math.floor(Math.random() * images.length)];
      } else if (templateIndex === 3) {
        const images = imageMap.character;
        newImage = images[Math.floor(Math.random() * images.length)];
      } else if (templateIndex === 4) {
        const images = imageMap.background;
        newImage = images[Math.floor(Math.random() * images.length)];
      }
      
      // Generate new color set using fast remix for instant performance
      const newColorSet = generateFastRemixColorSet();
      
      // Update only the modal preview styles (don't touch original bannerStyles)
      setModalPreviewStyles({
        image: newImage,
        gradient: { background: newColorSet.gradient },
        ctaColor: newColorSet.ctaColor,
        textColor: newColorSet.textColor,
        headingColor: newColorSet.headingColor,
        ctaTextColor: newColorSet.contrastRatios.ctaTextToCta
      });
      
      // No need to update selectedBanner.component since renderModalContent() 
      // will automatically use modalPreviewStyles when available
    }
  };

  // Function to render modal content with current or preview styles
  const renderModalContent = () => {
    if (!selectedBanner || selectedBanner.templateIndex === undefined) return null;
    
    const index = selectedBanner.templateIndex;
    const templateIndex = index % 5;
    
    // Get the template components
    const templates = [
      InstagramSquare1080,
      InstagramSquare1080Flipped, 
      InstagramSquare1080Float,
      InstagramSquare1080Character,
      InstagramSquare1080Background
    ];
    
    const SelectedTemplate = templates[templateIndex];
    const currentBanner = response?.banners[index];
    if (!currentBanner) return null;
    
    // Use modal preview styles if available, otherwise use original banner styles
    const originalStyles = bannerStyles[index] || {};
    const stylesToUse = modalPreviewStyles || originalStyles;
    
    return (
      <SelectedTemplate
        title={renderContent(currentBanner.content.headline)}
        subtitle={renderContent(currentBanner.content.description)}
        cta={renderContent(currentBanner.content.ctaText)}
        lob={selectedLOB}
        selectedImage={stylesToUse.image || originalStyles.image}
        selectedGradient={stylesToUse.gradient || originalStyles.gradient}
        selectedCtaColor={stylesToUse.ctaColor || originalStyles.ctaColor}
        selectedTextColor={stylesToUse.textColor || originalStyles.textColor}
        selectedHeadingColor={stylesToUse.headingColor || originalStyles.headingColor}
        selectedCtaTextColor={stylesToUse.ctaTextColor || originalStyles.ctaTextColor}
        isModal={true}
      />
    );
  };

  // Add new state for skeleton loading
  const [showSkeleton, setShowSkeleton] = useState(true);

  // Add useEffect to handle skeleton timing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isStreaming) {
      setShowSkeleton(true);
      // Remove skeleton after 1 second to show streaming content
      timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 1000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isStreaming]);

  return (
    <div className="flex h-screen bg-[#2A2B3B]">
      {/* Left Panel - Controls */}
      <div className="w-[25%] p-6 h-screen overflow-y-auto">
        <div className="h-full flex flex-col justify-between">
          <div className="flex-1 flex flex-col">
            {/* Add GIF image */}
            <div className="mb-8 flex justify-center">
              <Image 
                src="/images/loaders/p0.gif"
                alt="Loading Animation"
                width={150}
                height={150}
                priority
              />
            </div>

            <div className="w-full space-y-8">
              {/* First row of dropdowns */}
              <div className="grid grid-cols-2 gap-4">
                <CustomDropdown
                  label="Language"
                  options={languageOptions}
                  value={language}
                  onChange={setLanguage}
                />

                <CustomDropdown
                  label="Theme"
                  options={themeOptions}
                  value={theme}
                  onChange={setTheme}
                />
              </div>

              <div className="w-full">
                <CustomDropdown
                  label="LOB"
                  options={lobOptions}
                  value={lob}
                  onChange={setLob}
                />
              </div>

              {/* Input form */}
              <form onSubmit={handleSubmit}>
                <div className="relative bg-[#363748] rounded-2xl p-6">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type something..."
                    rows={3}
                    className="w-full bg-transparent text-white
                              border-0 focus:ring-0 focus:outline-none
                              placeholder-gray-400 text-lg resize-none
                              align-top leading-relaxed"
                    disabled={isLoading}
                    style={{ 
                      minHeight: '120px',
                      verticalAlign: 'top'
                    }}
                  />
                  <button 
                    type="submit"
                    className="w-full mt-4 py-2.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 
                              text-white text-lg font-medium rounded-xl
                              hover:from-purple-600 hover:via-pink-600 hover:to-purple-600
                              focus:outline-none
                              disabled:opacity-50 disabled:cursor-not-allowed 
                              transition-all duration-200
                              animate-gradient"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Generating...</span>
                      </div>
                    ) : (
                      'Generate'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* Footer */}
          <div className="text-center text-xs text-gray-500 mt-8">
            Made with <span className="text-red-500 inline-block animate-heart">❤️</span> by ACKOdesign
          </div>
        </div>
      </div>

      {/* Right Panel - Banner Display */}
      <div className="flex-1 p-6 overflow-y-auto bg-[#1F2037]">
        {!response && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-200 mb-2">
                Ready to Generate Banners
              </h2>
              <p className="text-gray-400">
                Enter a topic in the left panel to generate multiple banner variations.
              </p>
            </div>
          </div>
        )}

        {response && (
          <div className="mb-12">
            {showSkeleton ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="h-8 w-48 bg-gray-700/50 rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-3 gap-8 auto-rows-min">
                  {[...Array(5)].map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-200 mb-2">
                      Generated Banners
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {response.banners.length} banner variations • Click to preview and download
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-10 auto-rows-min justify-items-center">
                  {response.banners.map((banner, i) => renderSingleBanner(banner, i))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div 
            className={`fixed inset-0 bg-black/60 backdrop-blur-xl ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
            onClick={handleClose}
          />
          
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div 
              className={`
                w-full max-w-fit
                bg-[#2A2B3B]/90 backdrop-blur-sm
                rounded-2xl p-8
                shadow-[0_0_50px_0_rgba(0,0,0,0.3)]
                border border-white/10
                ${isClosing ? 'animate-scaleOut' : 'animate-scaleIn'}
              `}
            >
              {/* Header with enhanced styling */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium text-white/90">
                  {selectedBanner?.title}
                </h3>
                <button
                  onClick={handleClose}
                  className="text-white/70 hover:text-white/90 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Content with subtle shadow */}
              <div className="mt-4 shadow-lg rounded-xl overflow-hidden modal-content">
                {selectedBanner && renderModalContent()}
              </div>
              
              {/* Footer with enhanced buttons */}
              <div className="mt-8 flex justify-between gap-4">
                <button
                  className="px-6 py-2.5 text-sm font-medium text-white 
                             bg-gradient-to-r from-purple-500 to-purple-600
                             rounded-lg hover:from-purple-600 hover:to-purple-700 
                             transition-all duration-200 ease-out
                             shadow-lg shadow-purple-500/30
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  onClick={handleRemix}
                >
                  🔥 Remix
                </button>
                <button
                  className="px-6 py-2.5 text-sm font-medium text-white
                             bg-gradient-to-r from-blue-500 to-blue-600
                             rounded-lg hover:from-blue-600 hover:to-blue-700
                             transition-all duration-200 ease-out
                             shadow-lg shadow-blue-500/30
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={handleDownload}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
