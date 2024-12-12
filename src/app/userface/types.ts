export type ComparisonPoints = {
  us: string[]
  them: string[]
}

export type BannerContent = {
  headline: string
  description: string
  ctaText: string
  comparisonPoints?: ComparisonPoints
}

export type BannerDesign = {
  template: 'comparison' | 'standard'
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