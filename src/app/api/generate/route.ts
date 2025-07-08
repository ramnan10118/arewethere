// API Route
import OpenAI from 'openai';

export async function POST(req: Request) {
  let prompt: string, language: string, theme: string, lob: string;
  
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const requestData = await req.json();
    prompt = requestData.prompt;
    language = requestData.language;
    theme = requestData.theme;
    lob = requestData.lob;
    
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
    
    // Retry logic for network issues
    const maxRetries = 2;
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${maxRetries} to generate banners...`);
        
        const systemPrompt = `You are a professional banner designer. Generate 3-5 banner variations in JSON format.
          
          IMPORTANT: Create engaging banners based on the user's prompt and theme. Be creative and relevant.
          
          ${languageInstructions}
          ${themeInstructions}
          ${comparisonInstructions}
          
          CONTENT REQUIREMENTS:
          - Headlines: Keep concise (around 5-8 words), related to user's prompt
          - Descriptions: Brief and compelling (around 8-15 words)
          - CTAs: Short and action-oriented (1-4 words)
          - Content should relate to the user's prompt and theme
          - Focus on clear, engaging messaging
          
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
          
          KEY REQUIREMENTS:
          - Language: ${language}
          - Theme: ${theme} (incorporate this theme)
          - Line of business: ${lob || 'auto'} insurance
          - Content should relate to "${prompt}"
          
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
          
          Create varied approaches to "${prompt}" with ${theme} elements.`;
          
    console.log('📋 System prompt:', systemPrompt);
    console.log('👤 User prompt:', userPrompt);
    console.log('🎯 Original user input:', prompt);
    
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
      temperature: 0.6, // Slightly more consistent
      max_tokens: 2000 // Ensure sufficient response length
    });

    const responseText = completion.choices[0]?.message?.content;
    console.log('🤖 OpenAI raw response:', responseText);
    
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response with error handling
    let bannerData;
    try {
      // Try to extract JSON if response has extra text
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}') + 1;
      const jsonString = responseText.substring(jsonStart, jsonEnd);
      bannerData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      throw new Error('Invalid JSON response from AI');
    }
    console.log('📦 Parsed banner data:', JSON.stringify(bannerData, null, 2));
    console.log('✅ Successfully generated', bannerData.banners?.length || 0, 'banners');
    
    // Ensure at least 3 banners are returned (more flexible)
    if (!bannerData.banners || bannerData.banners.length < 3) {
      console.warn('API returned too few banners, using fallback');
      throw new Error('Insufficient banner count - using fallback');
    }
    
    // Pad with duplicates if we got less than 5 banners
    while (bannerData.banners.length < 5) {
      const randomBanner = bannerData.banners[Math.floor(Math.random() * bannerData.banners.length)];
      bannerData.banners.push({ ...randomBanner });
    }
    
        return new Response(JSON.stringify(bannerData), {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
      } catch (attemptError) {
        console.error(`❌ Attempt ${attempt} failed:`, attemptError?.message);
        lastError = attemptError;
        
        // If it's a network issue and we have retries left, wait and try again
        if (attempt < maxRetries && (attemptError?.message?.includes('Connection error') || attemptError?.cause?.code === 'ETIMEDOUT')) {
          console.log(`⏳ Waiting 2 seconds before retry...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        
        // If it's not a network issue or we're out of retries, break and use fallback
        break;
      }
    }
    
    // If we get here, all retries failed
    throw lastError || new Error('All retry attempts failed');
  } catch (error) {
    console.error('API Error Details:', error)
    console.error('Error message:', error?.message)
    console.error('Error type:', typeof error)
    
    // Check if it's an OpenAI API error
    if (error?.error?.type) {
      console.error('OpenAI API Error Type:', error.error.type)
      console.error('OpenAI API Error Code:', error.error.code)
    }
    
    // Check if it's a connection/timeout error
    if (error?.message?.includes('Connection error') || error?.message?.includes('timeout') || error?.cause?.code === 'ETIMEDOUT') {
      console.error('🔌 Network/Connection issue detected - using fallback')
    } else if (error?.message?.includes('JSON')) {
      console.error('📝 JSON parsing issue - using fallback')
    } else {
      console.error('❓ Unknown error - using fallback')
    }
    
    // Generate theme-aware fallback banners
    console.log('Generating fallback response for theme:', theme)
    
    const getFallbackBanners = (selectedTheme: string) => {
      const themeContent = {
        fomo: [
          { headline: 'Others are saving!', description: 'Don\'t miss out', ctaText: 'Join Now' },
          { headline: 'Limited spots left', description: 'Act before it\'s gone', ctaText: 'Secure Now' },
          { headline: 'Your neighbors saved', description: 'Why haven\'t you?', ctaText: 'Start Now' },
          { headline: 'Missing great deals?', description: 'Others aren\'t', ctaText: 'Get Yours' },
          { headline: 'Don\'t be left out', description: 'Join thousands', ctaText: 'Sign Up' }
        ],
        urgency: [
          { headline: 'Act Now!', description: 'Limited time offer', ctaText: 'Buy Today' },
          { headline: 'Expires Soon!', description: 'Don\'t wait', ctaText: 'Get Now' },
          { headline: 'Final Hours!', description: 'Offer ends tonight', ctaText: 'Hurry Up' },
          { headline: 'Time Running Out!', description: 'Secure your spot', ctaText: 'Act Fast' },
          { headline: 'Today Only!', description: 'Special pricing', ctaText: 'Buy Now' }
        ],
        exclusivity: [
          { headline: 'VIP Access Only', description: 'Exclusive offer', ctaText: 'Join VIP' },
          { headline: 'Members Only', description: 'Special pricing', ctaText: 'Get Access' },
          { headline: 'Invitation Only', description: 'Limited access', ctaText: 'Accept Now' },
          { headline: 'Premium Members', description: 'Exclusive benefits', ctaText: 'Upgrade' },
          { headline: 'Select Customers', description: 'Special treatment', ctaText: 'Qualify' }
        ],
        value: [
          { headline: 'Best Price Guaranteed', description: 'Save money today', ctaText: 'Save Now' },
          { headline: 'Cheapest Rates', description: 'Compare & save', ctaText: 'Get Quote' },
          { headline: 'Huge Savings', description: 'Up to 50% off', ctaText: 'Save Big' },
          { headline: 'Lowest Price', description: 'Beat any quote', ctaText: 'Start Now' },
          { headline: 'Great Value', description: 'More for less', ctaText: 'Compare' }
        ],
        trust: [
          { headline: 'Trusted by Millions', description: '5-star rated', ctaText: 'Join Us' },
          { headline: 'Secure & Reliable', description: 'Your safety first', ctaText: 'Get Protected' },
          { headline: '99.9% Uptime', description: 'Always there', ctaText: 'Trust Us' },
          { headline: 'Award Winning', description: 'Industry leader', ctaText: 'Choose Best' },
          { headline: 'Certified Safe', description: 'Fully licensed', ctaText: 'Feel Safe' }
        ],
        community: [
          { headline: 'Join Our Community', description: '1M+ happy members', ctaText: 'Join Us' },
          { headline: 'Together We Save', description: 'Community power', ctaText: 'Be Part' },
          { headline: 'Connect & Save', description: 'Social benefits', ctaText: 'Connect' },
          { headline: 'Community Rates', description: 'Group discounts', ctaText: 'Join Group' },
          { headline: 'Member Benefits', description: 'Exclusive community', ctaText: 'Become Member' }
        ]
      };

      const content = themeContent[selectedTheme] || themeContent.value;
      const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#F59E0B'];
      const ctaColors = ['#F59E0B', '#10B981', '#F59E0B', '#FBBF24', '#10B981'];

      return content.map((item, index) => ({
        design: { 
          template: 'standard', 
          layout: 'center', 
          colors: { 
            background: colors[index], 
            text: '#FFFFFF', 
            cta: ctaColors[index] 
          }
        },
        content: item
      }));
    };

    return new Response(JSON.stringify({
      banners: getFallbackBanners(theme)
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
}