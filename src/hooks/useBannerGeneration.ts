'use client'

import { useState } from 'react'
import { BannerResponse } from '../app/userface/types'

export function useBannerGeneration() {
  const [response, setResponse] = useState<BannerResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const generateBanners = async (input: string, language: string, theme: string, lob: string) => {
    setIsLoading(true)
    setIsStreaming(true)
    
    // Set initial loading banners
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
      if (!reader) throw new Error('No reader available')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split('\n').filter(Boolean)
        const lastLine = lines[lines.length - 1]
        
        try {
          const parsedData = JSON.parse(lastLine) as BannerResponse
          await delay(300)
          setResponse(current => {
            if (!current) return parsedData
            return {
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
            }
          })
        } catch (e) {
          console.error('Error parsing JSON:', e)
        }
      }
    } catch (error) {
      console.error('Error:', error)
      throw error
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
    }
  }

  return {
    response,
    isLoading,
    isStreaming,
    generateBanners
  }
}