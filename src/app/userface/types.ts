import { ReactNode } from 'react'

export type ComparisonPoints = {
  us: string[]
  them: string[]
}

export type BannerContent = {
  headline: string | ReactNode
  description: string | ReactNode
  ctaText: string | ReactNode
  comparisonPoints?: ComparisonPoints
}

export type BannerDesign = {
  template: 'comparison' | 'standard' | 'testimonial'
  layout: string
  colors: Record<string, string>
}

export type Banner = {
  design: BannerDesign
  content: BannerContent
}

export type BannerResponse = {
  banners: Banner[]
} 