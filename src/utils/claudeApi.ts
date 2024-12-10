import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_CLAUDE_API_KEY,
  dangerouslyAllowBrowser: true
});

interface BannerCopy {
  headline: string;
  subheadline: string;
  cta: string;
}

interface BannerSizes {
  leaderboard: BannerCopy;
  rectangle: BannerCopy;
  skyscraper: BannerCopy;
  largeRectangle: BannerCopy;
  instagramStory: BannerCopy;
}

export async function generateBannerCopy(prompt: string): Promise<BannerSizes> {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `You are a JSON generator. Return ONLY valid JSON, no other text or explanation.

        Based on this prompt: "${prompt}"
        Generate banner ad copy variations that fit these requirements:

        Leaderboard (728x90):
        - Headline: 25-35 characters
        - Subheadline: 50-70 characters
        - CTA: STRICTLY 2 WORDS ONLY, no more no less (e.g., "Get Started", "Learn More", "Try Now")

        Rectangle (300x250):
        - Headline: 20-30 characters
        - Subheadline: 70-90 characters
        - CTA: STRICTLY 2 WORDS ONLY

        Skyscraper (160x600):
        - Headline: 15-25 characters
        - Subheadline: 90-120 characters
        - CTA: STRICTLY 2 WORDS ONLY

        Large Rectangle (336x280):
        - Headline: 20-30 characters
        - Subheadline: 70-90 characters
        - CTA: STRICTLY 2 WORDS ONLY

        Instagram Story (1080x1920):
        - Headline: 30-40 characters
        - Subheadline: 80-100 characters
        - CTA: STRICTLY 2 WORDS ONLY

        CRITICAL: 
        1. Return ONLY the JSON object below, no other text
        2. Every CTA must be EXACTLY 2 words
        3. No hyphens or compound words in CTAs
        4. Valid CTAs: "Get Started", "Learn More", "Try Now"
        5. Invalid CTAs: "Sign Up Now", "Sign-up", "GetStarted"

        {
          "leaderboard": { "headline": "", "subheadline": "", "cta": "" },
          "rectangle": { "headline": "", "subheadline": "", "cta": "" },
          "skyscraper": { "headline": "", "subheadline": "", "cta": "" },
          "largeRectangle": { "headline": "", "subheadline": "", "cta": "" },
          "instagramStory": { "headline": "", "subheadline": "", "cta": "" }
        }`
      }]
    });

    // Parse the response
    const content = message.content[0].type === 'text' ? message.content[0].text : '';
    
    // Clean the response - remove any non-JSON text
    const jsonStart = content.indexOf('{');
    const jsonEnd = content.lastIndexOf('}') + 1;
    const jsonContent = content.slice(jsonStart, jsonEnd);

    try {
      const bannerCopy: BannerSizes = JSON.parse(jsonContent);
      return bannerCopy;
    } catch (parseError) {
      console.error('Error parsing Claude response:', parseError);
      throw new Error('Failed to parse banner copy from Claude response');
    }
  } catch (error) {
    console.error('Error generating banner copy:', error);
    throw error;
  }
} 