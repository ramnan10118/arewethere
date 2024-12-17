'use client'

import { useState, useEffect, useRef } from 'react'
import * as htmlToImage from 'html-to-image'
import {
  InstagramSquare1080,
  InstagramSquare1080Flipped,
  InstagramSquare1080Float,
  InstagramSquare1080Character,
  InstagramSquare1080Testimonial,
  InstagramSquare1080Background,
  FeatureMatrixBanner1080
} from '../../components/Banner/GoogleBanners'
import Masonry from 'react-masonry-css'
import type { ReactNode } from 'react'
import Image from 'next/image'


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

// Add JumbledText component for banner content
function JumbledBannerText({ text }: { text: string }) {
  const [jumbledText, setJumbledText] = useState(text);
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  useEffect(() => {
    const interval = setInterval(() => {
      const jumbled = text
        .split('')
        .map((char) => {
          if (char === ' ') return ' ';
          if (Math.random() > 0.7) {
            return characters.charAt(Math.floor(Math.random() * characters.length));
          }
          return char;
        })
        .join('');

      setJumbledText(jumbled);
    }, 150);

    return () => clearInterval(interval);
  }, [text]);

  return jumbledText;
}

const DEFAULT_BANNER: Banner = {
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
    headline: <JumbledBannerText text="Generating your headline..." />,
    description: <JumbledBannerText text="Creating the perfect description for your needs..." />,
    ctaText: <JumbledBannerText text="Loading..." />
  }
}

function hasContent(content: BannerContent | undefined, field: keyof BannerContent): boolean {
  return !!(content?.[field] && content[field] !== 'Generating your headline...' && 
    content[field] !== 'Creating the perfect description for your needs...' && 
    content[field] !== 'Loading...')
}

// Add delay between updates
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Add this callback function
const setRef = (refs: React.MutableRefObject<(HTMLDivElement | null)[]>, index: number) => 
  (element: HTMLDivElement | null) => {
    refs.current[index] = element;
  };

// Add these styles in your CSS or directly in the component
const masonryStyles = {
  display: 'flex',
  marginLeft: '-30px', /* gutter size offset */
  width: 'auto'
}

const masonryColumnStyles = {
  paddingLeft: '30px', /* gutter size */
  backgroundClip: 'padding-box'
}

interface DropdownOption {
  value: string;
  label: string;
}

function CustomDropdown({ 
  options, 
  value, 
  onChange, 
  label 
}: { 
  options: DropdownOption[], 
  value: string, 
  onChange: (value: string) => void,
  label: string 
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium tracking-wider text-gray-400 uppercase mb-2">{label}</label>
      <div 
        className="relative bg-[#363748] rounded-2xl cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="p-5 flex justify-between items-center">
          <span className="text-white text-lg">
            {options.find(opt => opt.value === value)?.label}
          </span>
          <svg 
            className={`w-5 h-5 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {isOpen && (
          <div className="absolute w-full mt-2 py-2 bg-[#363748] rounded-2xl shadow-lg z-50 overflow-hidden">
            {options.map((option) => (
              <div
                key={option.value}
                className={`mx-2 px-4 py-3 cursor-pointer transition-colors duration-200 rounded-xl
                          ${option.value === value 
                            ? 'text-white' 
                            : 'text-gray-400 hover:text-white hover:bg-[#404255]'}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type SelectedBanner = {
  component: ReactNode
  title: string
}

// These can stay outside the component
const modalAnimation = {
  overlay: "animate-fadeIn",
  modal: "animate-scaleIn"
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

// Add SkeletonCard component
function SkeletonCard() {
  return (
    <div className="mb-4">
      <div className="transform scale-70 origin-top cursor-pointer">
        <div className="w-[500px] h-[500px] bg-[#2A2B3B] rounded-xl overflow-hidden">
          
          
          {/* Banner Content */}
          <div className="p-4">
            <div className="aspect-square bg-gray-700/50 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add JumbledText component
function JumbledText() {
  const [text, setText] = useState('Generating');
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let dots = '';
    
    interval = setInterval(() => {
      // Add dots animation
      dots = dots.length < 3 ? dots + '.' : '';
      
      // Create jumbled text
      const jumbled = 'Generating'
        .split('')
        .map((char, index) => {
          if (Math.random() > 0.8) {
            return characters.charAt(Math.floor(Math.random() * characters.length));
          }
          return char;
        })
        .join('') + dots;

      setText(jumbled);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="ml-2 text-sm font-normal text-blue-400">
      {text}
    </span>
  );
}

// Add this helper function at the top
const toString = (node: React.ReactNode): string => {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return node.toString();
  if (node instanceof Array) return node.map(toString).join('');
  return '';
};

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
    }, 200)
  }

  const [input, setInput] = useState('')
  const [language, setLanguage] = useState('english')
  const [theme, setTheme] = useState('value')
  const [response, setResponse] = useState<BannerResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)

  // Update refs to only what we need
  const instagramRefs = useRef<(HTMLDivElement | null)[]>([])
  const instagramFlippedRefs = useRef<(HTMLDivElement | null)[]>([])
  const instagramFloatRefs = useRef<(HTMLDivElement | null)[]>([])
  const instagramCharacterRefs = useRef<(HTMLDivElement | null)[]>([])
  const instagramTestimonialRefs = useRef<(HTMLDivElement | null)[]>([])
  const instagramBackgroundRefs = useRef<(HTMLDivElement | null)[]>([])
  const featureMatrixRefs = useRef<(HTMLDivElement | null)[]>([])

  // Initialize refs
  useEffect(() => {
    if (response?.banners) {
      const length = response.banners.length
      instagramRefs.current = Array(length).fill(null)
      instagramFlippedRefs.current = Array(length).fill(null)
      instagramFloatRefs.current = Array(length).fill(null)
      instagramCharacterRefs.current = Array(length).fill(null)
      instagramTestimonialRefs.current = Array(length).fill(null)
      instagramBackgroundRefs.current = Array(length).fill(null)
      featureMatrixRefs.current = Array(length).fill(null)
    }
  }, [response?.banners?.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setIsStreaming(true)
    
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
            headline: <JumbledBannerText text="Generating your headline..." />,
            description: <JumbledBannerText text="Creating the perfect description for your needs..." />,
            ctaText: <JumbledBannerText text="Loading..." />
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
            headline: <JumbledBannerText text="Generating your headline..." />,
            description: <JumbledBannerText text="Creating the perfect description for your needs..." />,
            ctaText: <JumbledBannerText text="Loading..." />
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

      const reader = res.body?.getReader()
      if (!reader) return

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split('\n').filter(Boolean)
        const lastLine = lines[lines.length - 1]
        
        try {
          const parsedData = JSON.parse(lastLine) as BannerResponse
          await delay(300)
          setResponse(current => ({
            banners: current.banners.map((banner, index) => ({
              ...banner,
              design: {
                ...banner.design,
                ...parsedData.banners[index]?.design
              },
              content: {
                ...banner.content,
                headline: parsedData.banners[index]?.content?.headline || banner.content.headline,
                description: parsedData.banners[index]?.content?.description || banner.content.description,
                ctaText: parsedData.banners[index]?.content?.ctaText || banner.content.ctaText,
                comparisonPoints: parsedData.banners[index]?.content?.comparisonPoints
              }
            }))
          }))
        } catch (e) {
          console.error('Error parsing JSON:', e)
        }
      }
    } catch (error) {
      console.error('Error:', error)
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
    { value: 'health', label: 'Health' },
    { value: 'life', label: 'Life' },
    { value: 'ackodrive', label: 'AckoDrive' },
    { value: 'auto', label: 'Auto' }
  ];

  const handleBannerClick = (component: ReactNode, title: string) => {
    setSelectedBanner({ component, title })
    setIsModalOpen(true)
  }

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
          const dataUrl = await htmlToImage.toPng(modalContent)
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

  // Update renderBanners to return an array
  const renderBanners = (banner: Banner, index: number) => {
    const bannerComponents = [
      // Standard Instagram
      <div className="mb-4" key="standard">
        <div 
          className="transform scale-70 origin-top cursor-pointer hover:opacity-90 transition-opacity" 
          ref={setRef(instagramRefs, index)}
          onClick={() => handleBannerClick(
            <InstagramSquare1080
              title={renderContent(banner.content.headline)}
              subtitle={renderContent(banner.content.description)}
              cta={renderContent(banner.content.ctaText)}
              lob={selectedLOB}
            />,
            'Standard Instagram Banner'
          )}
        >
          <InstagramSquare1080
            title={renderContent(banner.content.headline)}
            subtitle={renderContent(banner.content.description)}
            cta={renderContent(banner.content.ctaText)}
            lob={selectedLOB}
          />
        </div>
      </div>,

      // Flipped Instagram
      <div className="mb-4" key="flipped">
        <div 
          className="transform scale-70 origin-top cursor-pointer hover:opacity-90 transition-opacity" 
          ref={setRef(instagramFlippedRefs, index)}
          onClick={() => handleBannerClick(
            <InstagramSquare1080Flipped
              title={renderContent(banner.content.headline)}
              subtitle={renderContent(banner.content.description)}
              cta={renderContent(banner.content.ctaText)}
              lob={selectedLOB}
            />,
            'Flipped Instagram Banner'
          )}
        >
          <InstagramSquare1080Flipped
            title={renderContent(banner.content.headline)}
            subtitle={renderContent(banner.content.description)}
            cta={renderContent(banner.content.ctaText)}
            lob={selectedLOB}
          />
        </div>
      </div>,

      // Float Instagram
      <div className="mb-4" key="float">
        <div 
          className="transform scale-70 origin-top cursor-pointer hover:opacity-90 transition-opacity" 
          ref={setRef(instagramFloatRefs, index)}
          onClick={() => handleBannerClick(
            <InstagramSquare1080Float
              title={renderContent(banner.content.headline)}
              subtitle={renderContent(banner.content.description)}
              cta={renderContent(banner.content.ctaText)}
              lob={selectedLOB}
            />,
            'Float Instagram Banner'
          )}
        >
          <InstagramSquare1080Float
            title={renderContent(banner.content.headline)}
            subtitle={renderContent(banner.content.description)}
            cta={renderContent(banner.content.ctaText)}
            lob={selectedLOB}
          />
        </div>
      </div>,

      // Character Instagram
      <div className="mb-4" key="character">
        <div 
          className="transform scale-70 origin-top cursor-pointer hover:opacity-90 transition-opacity" 
          ref={setRef(instagramCharacterRefs, index)}
          onClick={() => handleBannerClick(
            <InstagramSquare1080Character
              title={renderContent(banner.content.headline)}
              subtitle={renderContent(banner.content.description)}
              cta={renderContent(banner.content.ctaText)}
              lob={selectedLOB}
            />,
            'Character Instagram Banner'
          )}
        >
          <InstagramSquare1080Character
            title={renderContent(banner.content.headline)}
            subtitle={renderContent(banner.content.description)}
            cta={renderContent(banner.content.ctaText)}
            lob={selectedLOB}
          />
        </div>
      </div>,

      // Background Instagram
      <div className="mb-4" key="background">
        <div 
          className="transform scale-70 origin-top cursor-pointer hover:opacity-90 transition-opacity" 
          ref={setRef(instagramBackgroundRefs, index)}
          onClick={() => handleBannerClick(
            <InstagramSquare1080Background
              title={renderContent(banner.content.headline)}
              subtitle={renderContent(banner.content.description)}
              cta={renderContent(banner.content.ctaText)}
              lob={selectedLOB}
            />,
            'Background Instagram Banner'
          )}
        >
          <InstagramSquare1080Background
            title={renderContent(banner.content.headline)}
            subtitle={renderContent(banner.content.description)}
            cta={renderContent(banner.content.ctaText)}
            lob={selectedLOB}
          />
        </div>
      </div>
    ];

    return bannerOrder.map(i => bannerComponents[i]);
  };

  // Revert handleRemix to original
  const handleRemix = () => {
    const modalContent = document.querySelector('.modal-content') as HTMLElement;
    if (modalContent) {
      const clone = selectedBanner?.component;
      setSelectedBanner(prev => prev ? {
        ...prev,
        component: null
      } : null);
      setTimeout(() => {
        setSelectedBanner(prev => prev ? {
          ...prev,
          component: clone
        } : null);
      }, 0);
    }
  };

  // Add new state for skeleton loading
  const [showSkeleton, setShowSkeleton] = useState(true);

  // Add useEffect to handle skeleton timing
  useEffect(() => {
    if (isStreaming) {
      setShowSkeleton(true);
      // Remove skeleton after 1 second to show streaming content
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
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

        {response?.banners.map((banner, i) => (
          <div key={i}>
            <div className="mb-12">
              {showSkeleton ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-8 w-48 bg-gray-700/50 rounded animate-pulse"></div>
                  </div>
                  <Masonry
                    breakpointCols={{
                      default: 2,
                      1536: 2,
                      1280: 2,
                      1024: 1,
                      768: 1,
                    }}
                    className="flex -ml-1 w-auto"
                    columnClassName="pl-1 bg-clip-padding"
                  >
                    {[...Array(6)].map((_, index) => (
                      <SkeletonCard key={index} />
                    ))}
                  </Masonry>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-200">
                      
                    </h2>
                  </div>
                  <Masonry
                    breakpointCols={{
                      default: 2,
                      1536: 2,
                      1280: 2,
                      1024: 1,
                      768: 1,
                    }}
                    className="flex -ml-1 w-auto"
                    columnClassName="pl-1 bg-clip-padding"
                  >
                    {renderBanners(banner, i)}
                  </Masonry>
                </>
              )}
            </div>
            {i < response.banners.length - 1 && (
              <div className="border-t border-gray-700/50 my-8"></div>
            )}
          </div>
        ))}
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
                {selectedBanner?.component}
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
