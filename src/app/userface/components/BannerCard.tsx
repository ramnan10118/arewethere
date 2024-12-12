'use client'

import { useRef } from 'react'
import * as htmlToImage from 'html-to-image'

type BannerCardProps = {
  title: string
  format: string
  children: React.ReactNode
}

export default function BannerCard({ title, format, children }: BannerCardProps) {
  const bannerRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    if (!bannerRef.current) return
    try {
      const dataUrl = await htmlToImage.toPng(bannerRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        skipAutoScale: true
      })
      const link = document.createElement('a')
      link.download = `banner-${format}-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Error downloading banner:', err)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      
      <div className="relative group">
        <div ref={bannerRef} className="p-4">
          {children}
        </div>
        
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <button
            onClick={handleDownload}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h12a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(bannerRef.current?.outerHTML || '')}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
} 