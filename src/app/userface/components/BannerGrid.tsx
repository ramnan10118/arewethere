'use client'

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

type BannerGridProps = {
  banner: Banner
  isStreaming: boolean
}

export default function BannerGrid({ banner, isStreaming }: BannerGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BannerCard title="Instagram Standard" format="instagram-1080">
        <InstagramSquare1080
          title={banner.content.headline}
          subtitle={banner.content.description}
          cta={banner.content.ctaText}
        />
      </BannerCard>

      <BannerCard title="Instagram Flipped" format="instagram-flipped">
        <InstagramSquare1080Flipped
          title={banner.content.headline}
          subtitle={banner.content.description}
          cta={banner.content.ctaText}
        />
      </BannerCard>

      <BannerCard title="Instagram Float" format="instagram-float">
        <InstagramSquare1080Float
          title={banner.content.headline}
          subtitle={banner.content.description}
          cta={banner.content.ctaText}
        />
      </BannerCard>

      <BannerCard title="Instagram Character" format="instagram-character">
        <InstagramSquare1080Character
          title={banner.content.headline}
          subtitle={banner.content.description}
          cta={banner.content.ctaText}
        />
      </BannerCard>

      <BannerCard title="Instagram Testimonial" format="instagram-testimonial">
        <InstagramSquare1080Testimonial
          title={banner.content.headline}
          subtitle={banner.content.description}
          cta={banner.content.ctaText}
        />
      </BannerCard>

      <BannerCard title="Instagram Background" format="instagram-background">
        <InstagramSquare1080Background
          title={banner.content.headline}
          subtitle={banner.content.description}
          cta={banner.content.ctaText}
        />
      </BannerCard>

      {banner.design.template === 'comparison' && banner.content.comparisonPoints && (
        <BannerCard title="Feature Matrix" format="feature-matrix">
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
  )
} 