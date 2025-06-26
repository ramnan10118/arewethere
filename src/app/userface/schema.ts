import { z } from 'zod'

export const bannerSchema = z.object({
  banners: z.array(
    z.object({
      design: z.object({
        template: z.enum(['comparison', 'standard', 'testimonial']),
        layout: z.string(),
        colors: z.record(z.string())
      }),
      content: z.object({
        headline: z.string(),
        description: z.string(),
        ctaText: z.string(),
        comparisonPoints: z.object({
          us: z.array(z.string()),
          them: z.array(z.string())
        }).optional()
      })
    })
  )
})