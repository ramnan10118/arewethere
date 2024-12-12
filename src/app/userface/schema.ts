import { z } from 'zod'

// Modified schema
export const bannerSchema = z.object({
  banners: z.array(
    z.object({
      design: z.object({
        template: z.enum(['simple', 'promotional', 'announcement', 'discount', 'hero', 'comparison']),
        layout: z.enum(['left', 'center', 'right']).optional(),
        colors: z.object({
          background: z.string().optional(),
          text: z.string().optional(),
          cta: z.string().optional()
        }).optional()
      }),
      content: z.object({
        headline: z.string().optional(),
        description: z.string().optional(),
        ctaText: z.string().optional(),
        comparisonPoints: z.object({
          us: z.array(z.string()).optional(),
          them: z.array(z.string()).optional()
        }).optional()
      }).optional()
    })
  )
})