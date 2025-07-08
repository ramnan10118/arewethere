/**
 * Color Contrast Utilities
 * Implements WCAG 2.1 color contrast guidelines for accessibility
 */

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface ColorContrastResult {
  ratio: number;
  meetsAA: boolean;
  meetsAAA: boolean;
  isLargeText?: boolean;
}

/**
 * Convert hex color to RGB values
 */
export function hexToRgb(hex: string): RGBColor | null {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calculate relative luminance of a color according to WCAG
 * https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
 */
export function calculateLuminance(color: string | RGBColor): number {
  let rgb: RGBColor;
  
  if (typeof color === 'string') {
    const parsed = hexToRgb(color);
    if (!parsed) return 0;
    rgb = parsed;
  } else {
    rgb = color;
  }
  
  // Convert to 0-1 range
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  // Apply gamma correction
  const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  // Calculate luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string | RGBColor, color2: string | RGBColor): number {
  const lum1 = calculateLuminance(color1);
  const lum2 = calculateLuminance(color2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG requirements
 */
export function meetsContrastRequirement(
  ratio: number, 
  level: 'AA' | 'AAA' = 'AA', 
  isLargeText: boolean = false
): boolean {
  if (level === 'AA') {
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
  } else {
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  }
}

/**
 * Get comprehensive contrast analysis between two colors
 */
export function analyzeContrast(
  foreground: string, 
  background: string, 
  isLargeText: boolean = false
): ColorContrastResult {
  const ratio = getContrastRatio(foreground, background);
  
  return {
    ratio,
    meetsAA: meetsContrastRequirement(ratio, 'AA', isLargeText),
    meetsAAA: meetsContrastRequirement(ratio, 'AAA', isLargeText),
    isLargeText
  };
}

/**
 * Extract dominant color from a CSS gradient string
 * This is a simplified version that takes the first color in the gradient
 */
export function getGradientDominantColor(gradient: string): string {
  // Match hex colors in the gradient string
  const hexMatches = gradient.match(/#[a-fA-F0-9]{6}/g);
  if (hexMatches && hexMatches.length > 0) {
    return hexMatches[0];
  }
  
  // Match rgb/rgba colors
  const rgbMatches = gradient.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+)?\s*\)/g);
  if (rgbMatches && rgbMatches.length > 0) {
    const match = rgbMatches[0].match(/(\d+)/g);
    if (match && match.length >= 3) {
      const r = parseInt(match[0]);
      const g = parseInt(match[1]);
      const b = parseInt(match[2]);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
  }
  
  // Fallback to a neutral color
  return '#808080';
}

/**
 * Determine if a color is light or dark based on luminance
 */
export function isLightColor(color: string): boolean {
  return calculateLuminance(color) > 0.5;
}

/**
 * Get the appropriate text color (black or white) for a background
 */
export function getOptimalTextColor(backgroundColor: string): string {
  const whiteContrast = getContrastRatio('#FFFFFF', backgroundColor);
  const blackContrast = getContrastRatio('#000000', backgroundColor);
  
  return whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
}