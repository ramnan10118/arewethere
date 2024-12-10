interface GradientColor {
  name: string;
  type: string;
  colors: string[];
}

interface GradientData {
  gradients: {
    [key: string]: GradientColor;
  };
}

// Calculate relative luminance of a color
function getLuminance(hexColor: string): number {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  // Relative luminance formula
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Determine if gradient is dark based on average luminance
export function isGradientDark(gradient: GradientColor): boolean {
  const [color1, color2] = gradient.colors;
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);
  const averageLuminance = (luminance1 + luminance2) / 2;
  return averageLuminance < 0.5;
}

export async function fetchGradients(): Promise<GradientData> {
  try {
    const response = await fetch('/gradient-json.json');
    if (!response.ok) {
      throw new Error('Failed to fetch gradients');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching gradients:', error);
    return { gradients: {} };
  }
}

export function getRandomGradient(gradients: GradientData): GradientColor | null {
  const gradientList = Object.values(gradients.gradients);
  if (gradientList.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * gradientList.length);
  return gradientList[randomIndex];
}

export function generateGradientStyle(gradient: GradientColor | null): { background: string } {
  if (!gradient) {
    return { background: 'linear-gradient(to right, #f3f4f6, #e5e7eb)' };
  }
  
  const [color1, color2] = gradient.colors;
  return { background: `linear-gradient(to right, ${color1}, ${color2})` };
} 