// API Route
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { bannerSchema } from '../../userface/schema';

export async function POST(req: Request) {
  const { prompt, language, theme } = await req.json();

  // Create language-specific prompt instructions
  const languageInstructions = {
    hindi: 'Generate the banner text in Hindi (हिंदी). Use Devanagari script.',
    tamil: 'Generate the banner text in Tamil (தமிழ்). Use Tamil script.',
    kannada: 'Generate the banner text in Kannada (ಕನ್ನಡ). Use Kannada script.',
    telugu: 'Generate the banner text in Telugu (తెలుగు). Use Telugu script.',
    marathi: 'Generate the banner text in Marathi (मराठी). Use Devanagari script.',
    english: 'Generate the banner text in English.',
  }[language] || 'Generate the banner text in English.';

  // Enhanced theme instructions with comparison-specific format
  const themeInstructions = {
    fomo: `Create a sense of urgency and fear of missing out. For comparison banners, highlight what customers miss without our service.`,
    urgency: `Emphasize the need to act quickly. For comparison banners, contrast immediate benefits vs delayed adoption.`,
    exclusivity: `Highlight the exclusive nature of the offer. For comparison banners, emphasize unique features vs standard offerings.`,
    value: `Focus on the value proposition. For comparison banners, clearly show price-to-feature benefits vs competitors.`,
    trust: `Build trust and credibility. For comparison banners, highlight security features and guarantees vs industry standards.`,
    community: `Foster community engagement. For comparison banners, contrast community features vs isolated experiences.`
  }[theme] || 'Create a general promotional banner.';

  // Add comparison-specific formatting instructions
  const comparisonInstructions = `
    When generating a comparison banner, structure the content as follows:
    - Template should be 'comparison'
    - Headline should be clear and competitive but professional
    - Description should set up the comparison context
    - ComparisonPoints must include exactly 3-4 points for each side:
      * "us": [array of our strongest features/benefits]
      * "them": [array of corresponding competitor limitations]
    - Each point should be:
      * Concise (max 8 words)
      * Parallel in structure
      * Factual and specific
      * Professional in tone (avoid negative language)
    Example format:
    {
      "design": {
        "template": "comparison",
        "layout": "center",
        "colors": { ... }
      },
      "content": {
        "headline": "Why Choose Our Platform?",
        "description": "See how we stack up against traditional solutions",
        "ctaText": "Start Your Free Trial",
        "comparisonPoints": {
          "us": ["24/7 Live Support", "Unlimited Storage", "Free Updates"],
          "them": ["Email Support Only", "Limited Storage", "Paid Updates"]
        }
      }
    }
  `;

  const { partialObjectStream } = await streamObject({
    model: openai('gpt-4o-mini'),
    schema: bannerSchema,
    prompt: `
      ${languageInstructions}
      ${themeInstructions}
      ${comparisonInstructions}
      Generate 3 banner variations for: ${prompt}
      At least one banner must be a comparison banner following the comparison format.
    `,
  });

  // Create a transform stream that validates comparison banner structure
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const partialObject of partialObjectStream) {
        // Validate comparison banner structure when template is 'comparison'
        const validBanners = partialObject.banners?.map(banner => {
          if (!banner) return null;
          if (banner.design?.template === 'comparison') {
            const points = banner.content?.comparisonPoints;
            if (!points?.us?.length ||
                !points?.them?.length ||
                points.us.length !== points.them.length ||
                points.us.length < 3 ||
                points.us.length > 4) {
              return null;
            }
          }
          return banner;
        }).filter(Boolean);
        if (validBanners?.length) {
          controller.enqueue(encoder.encode(JSON.stringify({ banners: validBanners }) + '\n'));
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}