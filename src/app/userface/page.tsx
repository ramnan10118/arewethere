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

// Define banner types based on the API response
type ComparisonPoints = {
  us: string[]
  them: string[]
}

type BannerContent = {
  headline: string
  description: string
  ctaText: string
  comparisonPoints?: ComparisonPoints
}

type BannerDesign = {
  template: 'comparison' | 'standard'
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
    headline: 'Generating your headline...',
    description: 'Creating the perfect description for your needs...',
    ctaText: 'Loading...'
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

export default function ChatInterface() {
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
    setResponse({ 
      banners: [DEFAULT_BANNER, DEFAULT_BANNER] 
    })
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, language, theme }),
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

  return (
    <div className="flex h-screen">
      {/* Left Panel - Controls */}
      <div className="w-[25%] bg-white border-r p-6 sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Banner Generator</h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="tamil">Tamil</option>
                <option value="kannada">Kannada</option>
                <option value="telugu">Telugu</option>
                <option value="marathi">Marathi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
              <select 
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full p-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="fomo">FOMO</option>
                <option value="urgency">Urgency</option>
                <option value="exclusivity">Exclusivity</option>
                <option value="value">Value</option>
                <option value="trust">Trust</option>
                <option value="community">Community</option>
              </select>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Topic</label>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter banner topic..."
                  className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
              
              <button 
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                  'Generate Banners'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Right Panel - Banner Display */}
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {!response && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Ready to Generate Banners
              </h2>
              <p className="text-gray-500">
                Enter a topic in the left panel to generate multiple banner variations.
              </p>
            </div>
          </div>
        )}

        {response?.banners.map((banner, i) => (
          <div key={i} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Banner Variation {i + 1}
                {isStreaming && (
                  <span className="ml-2 text-sm font-normal text-blue-500 animate-pulse">
                    Generating...
                  </span>
                )}
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
              {/* Standard Instagram */}
              <div className="mb-4">
                <div className="transform scale-70 origin-top" ref={setRef(instagramRefs, i)}>
                  <InstagramSquare1080
                    title={banner.content.headline}
                    subtitle={banner.content.description}
                    cta={banner.content.ctaText}
                  />
                </div>
              </div>

              {/* Flipped Instagram */}
              <div className="mb-4">
                <div className="transform scale-70 origin-top" ref={setRef(instagramFlippedRefs, i)}>
                  <InstagramSquare1080Flipped
                    title={banner.content.headline}
                    subtitle={banner.content.description}
                    cta={banner.content.ctaText}
                  />
                </div>
              </div>

              {/* Float Instagram */}
              <div className="mb-4">
                <div className="transform scale-70 origin-top" ref={setRef(instagramFloatRefs, i)}>
                  <InstagramSquare1080Float
                    title={banner.content.headline}
                    subtitle={banner.content.description}
                    cta={banner.content.ctaText}
                  />
                </div>
              </div>

              {/* Character Instagram */}
              <div className="mb-4">
                <div className="transform scale-70 origin-top" ref={setRef(instagramCharacterRefs, i)}>
                  <InstagramSquare1080Character
                    title={banner.content.headline}
                    subtitle={banner.content.description}
                    cta={banner.content.ctaText}
                  />
                </div>
              </div>

              {/* Testimonial Instagram */}
              <div className="mb-1">
                <div className="transform scale-70 origin-top" ref={setRef(instagramTestimonialRefs, i)}>
                  <InstagramSquare1080Testimonial
                    title={banner.content.headline}
                    subtitle={banner.content.description}
                    cta={banner.content.ctaText}
                  />
                </div>
              </div>

              {/* Background Instagram */}
              <div className="mb-1">
                <div className="transform scale-70 origin-top" ref={setRef(instagramBackgroundRefs, i)}>
                  <InstagramSquare1080Background
                    title={banner.content.headline}
                    subtitle={banner.content.description}
                    cta={banner.content.ctaText}
                  />
                </div>
              </div>

              {/* Feature Matrix (only for comparison template) */}
              {banner.design.template === 'comparison' && banner.content.comparisonPoints && (
                <div className="mb-1 col-span-2">
                  <div className="transform scale-70 origin-top" ref={setRef(featureMatrixRefs, i)}>
                    <FeatureMatrixBanner1080
                      title={banner.content.headline}
                      subtitle={banner.content.description}
                      cta={banner.content.ctaText}
                      basic={{
                        title: "Basic Plan",
                        price: "$29/mo",
                        features: banner.content.comparisonPoints.them.map(f => ({ name: f, included: true }))
                      }}
                      pro={{
                        title: "Pro Plan",
                        price: "$99/mo",
                        features: banner.content.comparisonPoints.us.map(f => ({ name: f, included: true }))
                      }}
                    />
                  </div>
                </div>
              )}
            </Masonry>
          </div>
        ))}
      </div>
    </div>
  )
}
