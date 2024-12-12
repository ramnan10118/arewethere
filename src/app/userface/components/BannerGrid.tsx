'use client'

import { useState } from 'react'
import { Banner } from '../types'
import BannerCard from './BannerCard'
import {
  InstagramSquare1080,
  InstagramSquare1080Flipped,
  InstagramSquare1080Float,
  InstagramSquare1080Character,
  InstagramSquare1080Testimonial,
  InstagramSquare1080Background,
  FeatureMatrixBanner1080
} from '@/components/Banner/GoogleBanners'

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

function PreviewModal({ isOpen, onClose, children }: PreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
      
      {/* Modal Content */}
      <div 
        className="relative z-10 transform transition-all duration-300 scale-105"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

type BannerGridProps = {
  banner: Banner
  isStreaming: boolean
  selectedLOB?: string
}

export default function BannerGrid({ banner, isStreaming, selectedLOB = 'auto' }: BannerGridProps) {
  const [previewBanner, setPreviewBanner] = useState<React.ReactNode | null>(null);

  const handlePreview = (bannerComponent: React.ReactNode) => {
    setPreviewBanner(bannerComponent);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BannerCard 
          title="Instagram Standard" 
          format="instagram-1080"
          onClick={() => handlePreview(
            <InstagramSquare1080
              title={banner.content.headline}
              subtitle={banner.content.description}
              cta={banner.content.ctaText}
            />
          )}
        >
          <InstagramSquare1080
            title={banner.content.headline}
            subtitle={banner.content.description}
            cta={banner.content.ctaText}
          />
        </BannerCard>

        <BannerCard 
          title="Instagram Flipped" 
          format="instagram-flipped"
          onClick={() => handlePreview(
            <InstagramSquare1080Flipped
              title={banner.content.headline}
              subtitle={banner.content.description}
              cta={banner.content.ctaText}
            />
          )}
        >
          <InstagramSquare1080Flipped
            title={banner.content.headline}
            subtitle={banner.content.description}
            cta={banner.content.ctaText}
          />
        </BannerCard>

        <BannerCard 
          title="Instagram Float" 
          format="instagram-float"
          onClick={() => handlePreview(
            <InstagramSquare1080Float
              title={banner.content.headline}
              subtitle={banner.content.description}
              cta={banner.content.ctaText}
              lob={selectedLOB}
            />
          )}
        >
          <InstagramSquare1080Float
            title={banner.content.headline}
            subtitle={banner.content.description}
            cta={banner.content.ctaText}
            lob={selectedLOB}
          />
        </BannerCard>

        <BannerCard 
          title="Instagram Character" 
          format="instagram-character"
          onClick={() => handlePreview(
            <InstagramSquare1080Character
              title={banner.content.headline}
              subtitle={banner.content.description}
              cta={banner.content.ctaText}
              lob={selectedLOB}
            />
          )}
        >
          <InstagramSquare1080Character
            title={banner.content.headline}
            subtitle={banner.content.description}
            cta={banner.content.ctaText}
            lob={selectedLOB}
          />
        </BannerCard>

        <BannerCard 
          title="Instagram Testimonial" 
          format="instagram-testimonial"
          onClick={() => handlePreview(
            <InstagramSquare1080Testimonial
              title={banner.content.headline}
              subtitle={banner.content.description}
              cta={banner.content.ctaText}
            />
          )}
        >
          <InstagramSquare1080Testimonial
            title={banner.content.headline}
            subtitle={banner.content.description}
            cta={banner.content.ctaText}
          />
        </BannerCard>

        <BannerCard 
          title="Instagram Background" 
          format="instagram-background"
          onClick={() => handlePreview(
            <InstagramSquare1080Background
              title={banner.content.headline}
              subtitle={banner.content.description}
              cta={banner.content.ctaText}
              lob={selectedLOB}
            />
          )}
        >
          <InstagramSquare1080Background
            title={banner.content.headline}
            subtitle={banner.content.description}
            cta={banner.content.ctaText}
            lob={selectedLOB}
          />
        </BannerCard>

        {banner.design.template === 'comparison' && banner.content.comparisonPoints && (
          <BannerCard 
            title="Feature Matrix" 
            format="feature-matrix"
            onClick={() => handlePreview(
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
            )}
          >
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
          </BannerCard>
        )}
      </div>

      <PreviewModal 
        isOpen={previewBanner !== null}
        onClose={() => setPreviewBanner(null)}
      >
        {previewBanner}
      </PreviewModal>
    </>
  )
} 