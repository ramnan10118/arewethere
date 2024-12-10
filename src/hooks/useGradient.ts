'use client';

import { useState, useEffect } from 'react';
import { fetchGradients, getRandomGradient, generateGradientStyle, isGradientDark } from '../utils/gradients';

export function useGradient() {
  const [gradientStyle, setGradientStyle] = useState<{ background: string }>({ 
    background: 'linear-gradient(to right, #f3f4f6, #e5e7eb)' 
  });
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGradient() {
      try {
        setIsLoading(true);
        const gradientData = await fetchGradients();
        const randomGradient = getRandomGradient(gradientData);
        const style = generateGradientStyle(randomGradient);
        setGradientStyle(style);
        if (randomGradient) {
          setIsDark(isGradientDark(randomGradient));
        }
        setError(null);
      } catch (err) {
        setError('Failed to load gradient');
        console.error('Error in useGradient:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadGradient();
  }, []);

  const refreshGradient = async () => {
    const gradientData = await fetchGradients();
    const randomGradient = getRandomGradient(gradientData);
    const style = generateGradientStyle(randomGradient);
    setGradientStyle(style);
    if (randomGradient) {
      setIsDark(isGradientDark(randomGradient));
    }
  };

  return {
    gradientStyle,
    isDark,
    isLoading,
    error,
    refreshGradient
  };
} 