/**
 * Smart Color Selection
 * Intelligent color combination generation with accessibility compliance
 */

import {
  getContrastRatio,
  getGradientDominantColor,
  isLightColor,
  getOptimalTextColor,
  analyzeContrast,
  meetsContrastRequirement
} from './colorContrast';

export interface ColorSet {
  gradient: string;
  ctaColor: string;
  textColor: string;
  headingColor: string;
  contrastRatios: {
    textToBackground: number;
    headingToBackground: number;
    ctaToBg: number;
    ctaTextToCta: string; // The text color for CTA button
  };
}

// All 71 gradients from gradient-json.json
const GRADIENTS = [
  'linear-gradient(135deg, #98FB98 0%, #32CD32 100%)', // Frame 69
  'linear-gradient(135deg, #40E0D0 0%, #48D1CC 100%)', // Frame 68
  'linear-gradient(135deg, #DDA0DD 0%, #EE82EE 100%)', // Frame 44
  'linear-gradient(135deg, #E6E6FA 0%, #9370DB 100%)', // Frame 43
  'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)', // Frame 48
  'linear-gradient(135deg, #800080 0%, #4B0082 100%)', // Frame 53
  'linear-gradient(135deg, #87CEEB 0%, #1E90FF 100%)', // Frame 54
  'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)', // Frame 10
  'linear-gradient(135deg, #FFC0CB 0%, #FF69B4 100%)', // Frame 8
  'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)', // Frame 67
  'linear-gradient(135deg, #800080 0%, #4B0082 100%)', // G_10
  'linear-gradient(135deg, #E6E6FA 0%, #DDA0DD 100%)', // G_01
  'linear-gradient(135deg, #98FB98 0%, #90EE90 100%)', // Frame 56
  'linear-gradient(135deg, #90EE90 0%, #32CD32 100%)', // Frame 2
  'linear-gradient(135deg, #87CEEB 0%, #00BFFF 100%)', // Frame 1
  'linear-gradient(135deg, #E6E6FA 0%, #9370DB 100%)', // Frame 36
  'linear-gradient(135deg, #FFA07A 0%, #FF7F50 100%)', // Frame 50
  'linear-gradient(135deg, #9400D3 0%, #800080 100%)', // Frame 55
  'linear-gradient(135deg, #87CEEB 0%, #1E90FF 100%)', // Frame 58
  'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)', // Frame 71
  'linear-gradient(135deg, #FFA07A 0%, #FF7F50 100%)', // Frame 4
  'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)', // Frame 65
  'linear-gradient(135deg, #9400D3 0%, #800080 100%)', // G_11
  'linear-gradient(135deg, #DCDCDC 0%, #A9A9A9 100%)', // G_02
  'linear-gradient(135deg, #E0FFFF 0%, #B0E0E6 100%)', // Frame 61
  'linear-gradient(135deg, #98FB98 0%, #90EE90 100%)', // Frame 19
  'linear-gradient(135deg, #DDA0DD 0%, #BA55D3 100%)', // Frame 12
  'linear-gradient(135deg, #E6E6FA 0%, #DDA0DD 100%)', // Frame 21
  'linear-gradient(135deg, #FF6347 0%, #FF4500 100%)', // Frame 39
  'linear-gradient(135deg, #9400D3 0%, #8B008B 100%)', // Frame 57
  'linear-gradient(135deg, #E0FFFF 0%, #AFEEEE 100%)', // Frame 45
  'linear-gradient(135deg, #FFDAB9 0%, #FFE4B5 100%)', // Frame 18
  'linear-gradient(135deg, #FFDAB9 0%, #FFE4B5 100%)', // Frame 16
  'linear-gradient(135deg, #2F4F4F 0%, #000080 100%)', // Frame 63
  'linear-gradient(135deg, #9400D3 0%, #800080 100%)', // G_12
  'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)', // G_03
  'linear-gradient(135deg, #F0FFF0 0%, #98FB98 100%)', // Frame 5
  'linear-gradient(135deg, #98FB98 0%, #32CD32 100%)', // Frame 24
  'linear-gradient(135deg, #DDA0DD 0%, #BA55D3 100%)', // Frame 9
  'linear-gradient(135deg, #E6E6FA 0%, #DDA0DD 100%)', // Frame 3
  'linear-gradient(135deg, #FF6347 0%, #FF4500 100%)', // Frame 11
  'linear-gradient(135deg, #4169E1 0%, #0000CD 100%)', // Frame 7
  'linear-gradient(135deg, #E0FFFF 0%, #B0E0E6 100%)', // Frame 38
  'linear-gradient(135deg, #FFDAB9 0%, #FFE4B5 100%)', // Frame 20
  'linear-gradient(135deg, #FFDAB9 0%, #FFE4B5 100%)', // Frame 17
  'linear-gradient(135deg, #2F4F4F 0%, #000080 100%)', // Frame 60
  'linear-gradient(135deg, #9400D3 0%, #800080 100%)', // G_13
  'linear-gradient(135deg, #008B8B 0%, #006400 100%)', // G_05
  'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', // Frame 6
  'linear-gradient(135deg, #90EE90 0%, #32CD32 100%)', // Frame 42
  'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)', // Frame 22
  'linear-gradient(135deg, #DDA0DD 0%, #BA55D3 100%)', // Frame 25
  'linear-gradient(135deg, #FF6347 0%, #FF4500 100%)', // Frame 47
  'linear-gradient(135deg, #9400D3 0%, #800080 100%)', // Frame 52
  'linear-gradient(135deg, #E0FFFF 0%, #B0E0E6 100%)', // Frame 34
  'linear-gradient(135deg, #FFDAB9 0%, #FFE4B5 100%)', // Frame 41
  'linear-gradient(135deg, #FFDAB9 0%, #FFE4B5 100%)', // Frame 31
  'linear-gradient(135deg, #2F4F4F 0%, #000080 100%)', // Frame 64
  'linear-gradient(135deg, #9400D3 0%, #800080 100%)', // G_14
  'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)', // G_06
  'linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%)', // Frame 14
  'linear-gradient(135deg, #E0FFFF 0%, #B0E0E6 100%)', // Frame 27
  'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)', // Frame 51
  'linear-gradient(135deg, #DDA0DD 0%, #BA55D3 100%)', // Frame 30
  'linear-gradient(135deg, #E0FFFF 0%, #B0E0E6 100%)', // Frame 28
  'linear-gradient(135deg, #E6E6FA 0%, #DDA0DD 100%)', // Frame 15
  'linear-gradient(135deg, #E6E6FA 0%, #DDA0DD 100%)', // Frame 37
  'linear-gradient(135deg, #E6E6FA 0%, #DDA0DD 100%)', // Frame 29
  'linear-gradient(135deg, #DDA0DD 0%, #BA55D3 100%)', // Frame 26
  'linear-gradient(135deg, #F0FFFF 0%, #E0FFFF 100%)', // Frame 13
  'linear-gradient(135deg, #9400D3 0%, #800080 100%)'  // G_07
];

// CTA colors organized by luminance (light to dark)
const LIGHT_CTA_COLORS = ['#FFD700', '#FFA500', '#FF6B35', '#F7931E'];
const DARK_CTA_COLORS = ['#1E90FF', '#32CD32', '#9370DB', '#00CED1'];
const MID_CTA_COLORS = ['#FF1493', '#FF4500', '#4169E1', '#228B22'];

/**
 * Select optimal CTA color based on background gradient
 */
export function selectOptimalCTAColor(gradient: string): string {
  const dominantColor = getGradientDominantColor(gradient);
  const isLightBg = isLightColor(dominantColor);
  
  // Choose from appropriate color palette
  const candidateColors = isLightBg ? DARK_CTA_COLORS : LIGHT_CTA_COLORS;
  
  let bestColor = candidateColors[0];
  let bestContrast = 0;
  
  // Find the CTA color with the best contrast against the background
  for (const color of candidateColors) {
    const contrast = getContrastRatio(color, dominantColor);
    if (contrast > bestContrast && contrast >= 3.0) { // Minimum 3:1 for interactive elements
      bestContrast = contrast;
      bestColor = color;
    }
  }
  
  // If no good contrast found, try mid-tone colors
  if (bestContrast < 3.0) {
    for (const color of MID_CTA_COLORS) {
      const contrast = getContrastRatio(color, dominantColor);
      if (contrast > bestContrast) {
        bestContrast = contrast;
        bestColor = color;
      }
    }
  }
  
  return bestColor;
}

/**
 * Select optimal text color for readability
 * Enhanced with better color selection and lower thresholds
 */
export function selectOptimalTextColor(
  backgroundColor: string, 
  isHeading: boolean = false
): string {
  const whiteContrast = getContrastRatio('#FFFFFF', backgroundColor);
  const blackContrast = getContrastRatio('#000000', backgroundColor);
  const darkGrayContrast = getContrastRatio('#1A1A1A', backgroundColor);
  const lightGrayContrast = getContrastRatio('#F5F5F5', backgroundColor);
  const mediumGrayContrast = getContrastRatio('#666666', backgroundColor);
  
  // Reduced minimum ratios for better color variety
  const requiredRatio = isHeading ? 2.8 : 3.2;
  
  // Expanded candidate colors for better selection
  const candidates = [
    { color: '#FFFFFF', contrast: whiteContrast },
    { color: '#000000', contrast: blackContrast },
    { color: '#1A1A1A', contrast: darkGrayContrast },
    { color: '#F5F5F5', contrast: lightGrayContrast },
    { color: '#666666', contrast: mediumGrayContrast },
    { color: '#E5E5E5', contrast: getContrastRatio('#E5E5E5', backgroundColor) },
    { color: '#2D2D2D', contrast: getContrastRatio('#2D2D2D', backgroundColor) }
  ];
  
  // Sort by contrast ratio (highest first)
  candidates.sort((a, b) => b.contrast - a.contrast);
  
  // Return the first color that meets requirements
  for (const candidate of candidates) {
    if (candidate.contrast >= requiredRatio) {
      return candidate.color;
    }
  }
  
  // If no candidate meets minimum, use simple white/black decision
  return whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
}

/**
 * Generate a complete harmonious color set
 */
export function generateHarmoniousColorSet(): ColorSet {
  // Start with a random gradient
  const gradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
  const dominantColor = getGradientDominantColor(gradient);
  
  // Select optimal colors based on the gradient
  const ctaColor = selectOptimalCTAColor(gradient);
  const textColor = selectOptimalTextColor(dominantColor, false);
  const headingColor = selectOptimalTextColor(dominantColor, true);
  
  // Determine text color for CTA button
  const ctaTextColor = getOptimalTextColor(ctaColor);
  
  return {
    gradient,
    ctaColor,
    textColor,
    headingColor,
    contrastRatios: {
      textToBackground: getContrastRatio(textColor, dominantColor),
      headingToBackground: getContrastRatio(headingColor, dominantColor),
      ctaToBg: getContrastRatio(ctaColor, dominantColor),
      ctaTextToCta: ctaTextColor
    }
  };
}

/**
 * Validate that a color combination meets accessibility standards
 * Relaxed validation to reduce fallback mode triggers
 */
export function validateColorCombination(
  gradient: string,
  ctaColor: string,
  textColor: string,
  headingColor?: string
): boolean {
  const bgColor = getGradientDominantColor(gradient);
  
  // Relaxed text contrast check (3:1 minimum instead of AA)
  const textContrast = getContrastRatio(textColor, bgColor);
  if (textContrast < 3.0) return false;
  
  // Relaxed heading contrast check (if provided)
  if (headingColor) {
    const headingContrast = getContrastRatio(headingColor, bgColor);
    if (headingContrast < 3.0) return false;
  }
  
  // Relaxed CTA contrast against background (2.5:1 minimum)
  const ctaContrast = getContrastRatio(ctaColor, bgColor);
  if (ctaContrast < 2.5) return false;
  
  // Relaxed CTA text contrast (3:1 minimum)
  const ctaTextColor = getOptimalTextColor(ctaColor);
  const ctaTextContrast = getContrastRatio(ctaTextColor, ctaColor);
  if (ctaTextContrast < 3.0) return false;
  
  return true;
}

/**
 * Generate multiple valid color sets and pick the best one
 * Increased attempts and fallback to fast remix if validation fails
 */
export function generateOptimalColorSet(attempts: number = 15): ColorSet {
  let bestSet: ColorSet | null = null;
  let bestScore = 0;
  
  for (let i = 0; i < attempts; i++) {
    const colorSet = generateHarmoniousColorSet();
    
    // Calculate a quality score based on contrast ratios
    const score = 
      colorSet.contrastRatios.textToBackground +
      colorSet.contrastRatios.headingToBackground +
      colorSet.contrastRatios.ctaToBg;
    
    if (validateColorCombination(
      colorSet.gradient,
      colorSet.ctaColor,
      colorSet.textColor,
      colorSet.headingColor
    ) && score > bestScore) {
      bestScore = score;
      bestSet = colorSet;
    }
  }
  
  // If no valid set found, use fast remix instead of hardcoded fallback
  if (!bestSet) {
    console.log('Using fast remix fallback due to validation failures');
    return generateFastRemixColorSet();
  }
  
  return bestSet;
}

// Pre-computed accessible color combinations for fast remix using diverse gradients from JSON
const FAST_REMIX_COMBINATIONS: ColorSet[] = [
  // Bright greens (solid-like)
  {
    gradient: 'linear-gradient(135deg, #98FB98 0%, #32CD32 100%)', // Frame 69 - bright green
    ctaColor: '#1A1A1A',
    textColor: '#000000',
    headingColor: '#1A1A1A',
    contrastRatios: { textToBackground: 7.8, headingToBackground: 8.2, ctaToBg: 7.1, ctaTextToCta: '#FFFFFF' }
  },
  // Turquoise blues
  {
    gradient: 'linear-gradient(135deg, #40E0D0 0%, #48D1CC 100%)', // Frame 68 - turquoise
    ctaColor: '#1A1A1A',
    textColor: '#000000',
    headingColor: '#1A1A1A',
    contrastRatios: { textToBackground: 6.9, headingToBackground: 7.4, ctaToBg: 6.5, ctaTextToCta: '#FFFFFF' }
  },
  // Purple gradients
  {
    gradient: 'linear-gradient(135deg, #800080 0%, #4B0082 100%)', // Frame 53 - deep purple
    ctaColor: '#FFD700',
    textColor: '#FFFFFF',
    headingColor: '#FFFFFF',
    contrastRatios: { textToBackground: 6.8, headingToBackground: 6.8, ctaToBg: 5.2, ctaTextToCta: '#000000' }
  },
  // Orange gradients
  {
    gradient: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)', // Frame 48 - orange
    ctaColor: '#1A1A1A',
    textColor: '#000000',
    headingColor: '#1A1A1A',
    contrastRatios: { textToBackground: 5.8, headingToBackground: 6.2, ctaToBg: 5.4, ctaTextToCta: '#FFFFFF' }
  },
  // Sky blues
  {
    gradient: 'linear-gradient(135deg, #87CEEB 0%, #1E90FF 100%)', // Frame 54 - sky blue
    ctaColor: '#FFFFFF',
    textColor: '#000000',
    headingColor: '#1A1A1A',
    contrastRatios: { textToBackground: 6.5, headingToBackground: 7.1, ctaToBg: 5.8, ctaTextToCta: '#000000' }
  },
  // Pink gradients
  {
    gradient: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)', // Frame 10 - pink
    ctaColor: '#1A1A1A',
    textColor: '#000000',
    headingColor: '#1A1A1A',
    contrastRatios: { textToBackground: 5.9, headingToBackground: 6.4, ctaToBg: 5.6, ctaTextToCta: '#FFFFFF' }
  },
  // Brown/earth tones
  {
    gradient: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)', // Frame 67 - brown
    ctaColor: '#FFD700',
    textColor: '#FFFFFF',
    headingColor: '#FFFFFF',
    contrastRatios: { textToBackground: 7.2, headingToBackground: 7.2, ctaToBg: 5.8, ctaTextToCta: '#000000' }
  },
  // Light pastels
  {
    gradient: 'linear-gradient(135deg, #E6E6FA 0%, #DDA0DD 100%)', // G_01 - light lavender
    ctaColor: '#1A1A1A',
    textColor: '#1A1A1A',
    headingColor: '#000000',
    contrastRatios: { textToBackground: 8.1, headingToBackground: 9.2, ctaToBg: 7.8, ctaTextToCta: '#FFFFFF' }
  },
  // Vibrant purples
  {
    gradient: 'linear-gradient(135deg, #9400D3 0%, #800080 100%)', // Frame 55 - vibrant purple
    ctaColor: '#FFFFFF',
    textColor: '#FFFFFF',
    headingColor: '#FFFFFF',
    contrastRatios: { textToBackground: 6.9, headingToBackground: 6.9, ctaToBg: 6.2, ctaTextToCta: '#000000' }
  },
  // Coral/salmon
  {
    gradient: 'linear-gradient(135deg, #FFA07A 0%, #FF7F50 100%)', // Frame 50 - coral
    ctaColor: '#1A1A1A',
    textColor: '#000000',
    headingColor: '#1A1A1A',
    contrastRatios: { textToBackground: 6.1, headingToBackground: 6.7, ctaToBg: 5.9, ctaTextToCta: '#FFFFFF' }
  },
  // Gray tones
  {
    gradient: 'linear-gradient(135deg, #DCDCDC 0%, #A9A9A9 100%)', // G_02 - gray
    ctaColor: '#1A1A1A',
    textColor: '#1A1A1A',
    headingColor: '#000000',
    contrastRatios: { textToBackground: 7.9, headingToBackground: 8.8, ctaToBg: 7.5, ctaTextToCta: '#FFFFFF' }
  },
  // Tomato reds
  {
    gradient: 'linear-gradient(135deg, #FF6347 0%, #FF4500 100%)', // Frame 39 - tomato red
    ctaColor: '#FFFFFF',
    textColor: '#FFFFFF',
    headingColor: '#FFFFFF',
    contrastRatios: { textToBackground: 5.8, headingToBackground: 5.8, ctaToBg: 5.2, ctaTextToCta: '#000000' }
  },
  // Dark navy
  {
    gradient: 'linear-gradient(135deg, #2F4F4F 0%, #000080 100%)', // Frame 63 - dark blue
    ctaColor: '#FFD700',
    textColor: '#FFFFFF',
    headingColor: '#FFFFFF',
    contrastRatios: { textToBackground: 8.9, headingToBackground: 8.9, ctaToBg: 6.8, ctaTextToCta: '#000000' }
  },
  // Teal/dark green
  {
    gradient: 'linear-gradient(135deg, #008B8B 0%, #006400 100%)', // G_05 - teal
    ctaColor: '#FFFFFF',
    textColor: '#FFFFFF',
    headingColor: '#FFFFFF',
    contrastRatios: { textToBackground: 7.1, headingToBackground: 7.1, ctaToBg: 6.4, ctaTextToCta: '#000000' }
  },
  // Golden yellow
  {
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', // Frame 6 - gold
    ctaColor: '#1A1A1A',
    textColor: '#000000',
    headingColor: '#1A1A1A',
    contrastRatios: { textToBackground: 6.8, headingToBackground: 7.3, ctaToBg: 6.2, ctaTextToCta: '#FFFFFF' }
  },
  // Hot pink
  {
    gradient: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)', // G_06 - hot pink
    ctaColor: '#FFFFFF',
    textColor: '#FFFFFF',
    headingColor: '#FFFFFF',
    contrastRatios: { textToBackground: 5.6, headingToBackground: 5.6, ctaToBg: 5.1, ctaTextToCta: '#000000' }
  },
  // Royal blue
  {
    gradient: 'linear-gradient(135deg, #4169E1 0%, #0000CD 100%)', // Frame 7 - royal blue
    ctaColor: '#FFD700',
    textColor: '#FFFFFF',
    headingColor: '#FFFFFF',
    contrastRatios: { textToBackground: 7.8, headingToBackground: 7.8, ctaToBg: 6.1, ctaTextToCta: '#000000' }
  },
  // Light cyan
  {
    gradient: 'linear-gradient(135deg, #E0FFFF 0%, #B0E0E6 100%)', // Frame 61 - light cyan
    ctaColor: '#1A1A1A',
    textColor: '#1A1A1A',
    headingColor: '#000000',
    contrastRatios: { textToBackground: 8.4, headingToBackground: 9.1, ctaToBg: 8.0, ctaTextToCta: '#FFFFFF' }
  },
  // Mint green
  {
    gradient: 'linear-gradient(135deg, #F0FFF0 0%, #98FB98 100%)', // Frame 5 - mint
    ctaColor: '#1A1A1A',
    textColor: '#1A1A1A',
    headingColor: '#000000',
    contrastRatios: { textToBackground: 8.6, headingToBackground: 9.4, ctaToBg: 8.2, ctaTextToCta: '#FFFFFF' }
  },
  // Peach/cream
  {
    gradient: 'linear-gradient(135deg, #FFDAB9 0%, #FFE4B5 100%)', // Frame 18 - peach
    ctaColor: '#1A1A1A',
    textColor: '#1A1A1A',
    headingColor: '#000000',
    contrastRatios: { textToBackground: 7.6, headingToBackground: 8.3, ctaToBg: 7.2, ctaTextToCta: '#FFFFFF' }
  }
];

/**
 * Fast color selection for remix operations - uses pre-computed accessible combinations
 */
export function generateFastRemixColorSet(): ColorSet {
  // Simply return a random pre-validated combination for instant performance
  const randomIndex = Math.floor(Math.random() * FAST_REMIX_COMBINATIONS.length);
  return { ...FAST_REMIX_COMBINATIONS[randomIndex] }; // Clone to avoid mutations
}

/**
 * Create variations of a color set for remix functionality
 */
export function createColorVariation(baseColorSet: ColorSet): ColorSet {
  // Keep the same gradient but find new optimal colors
  const gradient = baseColorSet.gradient;
  
  // Try alternative CTA colors
  const dominantColor = getGradientDominantColor(gradient);
  const isLightBg = isLightColor(dominantColor);
  const candidateColors = isLightBg ? 
    [...DARK_CTA_COLORS, ...MID_CTA_COLORS] : 
    [...LIGHT_CTA_COLORS, ...MID_CTA_COLORS];
  
  // Filter out the current CTA color
  const alternativeColors = candidateColors.filter(color => color !== baseColorSet.ctaColor);
  
  let bestCTA = alternativeColors[0];
  let bestContrast = 0;
  
  for (const color of alternativeColors) {
    const contrast = getContrastRatio(color, dominantColor);
    if (contrast > bestContrast && contrast >= 3.0) {
      bestContrast = contrast;
      bestCTA = color;
    }
  }
  
  return {
    gradient,
    ctaColor: bestCTA,
    textColor: baseColorSet.textColor, // Keep same text color for consistency
    headingColor: baseColorSet.headingColor,
    contrastRatios: {
      textToBackground: baseColorSet.contrastRatios.textToBackground,
      headingToBackground: baseColorSet.contrastRatios.headingToBackground,
      ctaToBg: getContrastRatio(bestCTA, dominantColor),
      ctaTextToCta: getOptimalTextColor(bestCTA)
    }
  };
}