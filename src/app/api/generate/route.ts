// API Route
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { prompt, language, theme, lob } = await req.json();
    
    console.log('📝 Received parameters:', { prompt, language, theme, lob });
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

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
  
  console.log('🌍 Language instruction:', languageInstructions);
  console.log('🎯 Theme instruction:', themeInstructions);

  // Add comparison-specific formatting instructions
  const comparisonInstructions = `When generating comparison banners, include comparisonPoints with "us" and "them" arrays of 3-4 benefits each.`;

    console.log('🚀 Starting banner generation...');
    
    const systemPrompt = `You are a professional banner designer. Generate exactly 5 banner variations in JSON format.
          
          CRITICAL: You must strictly follow the user's specific prompt and theme. Do NOT generate generic content.
          
          ${languageInstructions}
          ${themeInstructions}
          ${comparisonInstructions}
          
          CONTENT REQUIREMENTS:
          - Headlines: Maximum 8 words, directly related to user's prompt
          - Descriptions: Maximum 12 words, supporting the specific prompt and theme
          - CTAs: Maximum 3 words, action-oriented and theme-appropriate
          - ALL content must be specifically about the user's prompt, not generic insurance
          - Apply the specified theme consistently throughout all text
          
          Return ONLY a valid JSON object with this exact structure:
          {
            "banners": [
              {
                "design": {
                  "template": "standard",
                  "layout": "center",
                  "colors": {
                    "background": "#hex_color",
                    "text": "#hex_color", 
                    "cta": "#hex_color"
                  }
                },
                "content": {
                  "headline": "Banner headline (max 8 words)",
                  "description": "Banner description (max 12 words)", 
                  "ctaText": "Call to action (max 3 words)"
                }
              }
            ]
          }`;
          
    const userPrompt = `Generate 5 banner variations specifically about: "${prompt}"
          
          CRITICAL REQUIREMENTS:
          - Language: ${language}
          - Theme: ${theme} (apply this theme strongly to all content)
          - Line of business: ${lob || 'auto'} insurance
          - Every headline and description MUST relate directly to "${prompt}"
          
          Theme application for ${theme}:
          ${theme === 'urgency' ? '- Use time-sensitive language, deadlines, "limited time", "act now"' : ''}
          ${theme === 'fomo' ? '- Emphasize what users miss out on, "don\'t miss", "others are getting"' : ''}
          ${theme === 'value' ? '- Focus on savings, deals, "best price", "affordable", "save money"' : ''}
          ${theme === 'trust' ? '- Highlight reliability, security, "trusted", "secure", testimonials' : ''}
          ${theme === 'exclusivity' ? '- Use "exclusive", "VIP", "limited access", "special offer"' : ''}
          ${theme === 'community' ? '- Emphasize "join others", "community", "together", social proof' : ''}
          
          Create 5 different approaches to "${prompt}" while strongly applying the ${theme} theme:
          1. Direct benefit of "${prompt}" with ${theme} angle
          2. Problem-solution approach for "${prompt}" using ${theme}
          3. Comparison showing "${prompt}" advantage with ${theme}
          4. Emotional appeal about "${prompt}" through ${theme} lens
          5. Call-to-action focused on "${prompt}" with ${theme} urgency
          
          Each banner must be clearly about "${prompt}" and feel distinctly ${theme}-themed.`;
          
    console.log('📋 System prompt:', systemPrompt);
    console.log('👤 User prompt:', userPrompt);
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.7
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const bannerData = JSON.parse(responseText);
    
    return new Response(JSON.stringify(bannerData), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('API Error Details:', error)
    
    // Check if it's a quota exceeded error
    if (error?.message?.includes('429') || error?.message?.includes('quota')) {
      console.log('OpenAI quota exceeded, providing fallback response')
      
      // Return 5 simple fallback banners
      return new Response(JSON.stringify({
        banners: [
          {
            design: { template: 'standard', layout: 'center', colors: { background: '#10B981', text: '#FFFFFF', cta: '#F59E0B' }},
            content: {
              headline: 'Get Cheapest Insurance!',
              description: 'Save money today',
              ctaText: 'Buy Now'
            }
          },
          {
            design: { template: 'standard', layout: 'center', colors: { background: '#3B82F6', text: '#FFFFFF', cta: '#10B981' }},
            content: {
              headline: 'Insurance in 2 Minutes!',
              description: 'Instant approval',
              ctaText: 'Start Now'
            }
          },
          {
            design: { template: 'standard', layout: 'center', colors: { background: '#8B5CF6', text: '#FFFFFF', cta: '#F59E0B' }},
            content: {
              headline: 'Trusted Protection',
              description: '1 Crore+ happy customers',
              ctaText: 'Join Now'
            }
          },
          {
            design: { template: 'standard', layout: 'center', colors: { background: '#EF4444', text: '#FFFFFF', cta: '#FBBF24' }},
            content: {
              headline: 'Do It Today!',
              description: 'Limited time offer',
              ctaText: 'Get Now'
            }
          },
          {
            design: { template: 'standard', layout: 'center', colors: { background: '#F59E0B', text: '#FFFFFF', cta: '#10B981' }},
            content: {
              headline: 'Exclusive Offer!',
              description: 'Just for you',
              ctaText: 'Claim Now'
            }
          }
        ]
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate banners. Please check your API configuration.',
        details: error?.message || 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}