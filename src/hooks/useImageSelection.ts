'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'

interface ImageSelectionConfig {
  lob: string
  imageType: 'float' | 'character' | 'background' | 'full'
}

export function useImageSelection({ lob, imageType }: ImageSelectionConfig) {
  const [selectedImage, setSelectedImage] = useState('')

  const imageMap = useMemo(() => ({
    auto: {
      float: [
        '/images/auto/cars/Car_1.png',
        '/images/auto/cars/Car_2.png',
        '/images/auto/cars/Car_3.png',
        '/images/auto/cars/Car_4.png',
        '/images/auto/cars/Car_5.png',
        '/images/auto/cars/Car_6.png',
        '/images/auto/cars/Car_7.png',
        '/images/auto/cars/Car_8.png',
        '/images/auto/cars/Car_9.png',
        '/images/auto/cars/Car_10.png'
      ],
      character: [
        '/images/auto/character/character1.png',
        '/images/auto/character/character2.png',
        '/images/auto/character/character3.png',
        '/images/auto/character/character5.png',
        '/images/auto/character/character6.png',
        '/images/auto/character/character7.png'
      ],
      background: [
        '/images/auto/background/background_1.png',
        '/images/auto/background/background_2.png',
        '/images/auto/background/background_3.png',
        '/images/auto/background/background_4.png'
      ],
      full: [
        '/images/auto/full/full_1.png',
        '/images/auto/full/full_2.png'
      ]
    },
    health: {
      float: [
        '/images/health/medicine/Medicine_01.png',
        '/images/health/medicine/Medicine_02.png',
        '/images/health/medicine/Medicine_03.png',
        '/images/health/medicine/Medicine_04.png',
        '/images/health/medicine/Medicine_05.png',
        '/images/health/medicine/Medicine_06.png'
      ],
      character: [
        '/images/health/characters/character1.png',
        '/images/health/characters/character2.png',
        '/images/health/characters/character3.png',
        '/images/health/characters/character4.png',
        '/images/health/characters/character5.png',
        '/images/health/characters/character6.png',
        '/images/health/characters/character7.png'
      ],
      background: [
        '/images/health/background/Background_1.png',
        '/images/health/background/Background_2.png'
      ],
      full: [
        '/images/health/full/full_1.png',
        '/images/health/full/Full_2.png',
        '/images/health/full/Full_3.png',
        '/images/health/full/Full_4.png'
      ]
    }
  }), [])

  const getRandomImage = useCallback(() => {
    const lobKey = lob.toLowerCase() as keyof typeof imageMap
    const images = imageMap[lobKey]?.[imageType] || imageMap.auto[imageType]
    return images[Math.floor(Math.random() * images.length)]
  }, [lob, imageType, imageMap])

  useEffect(() => {
    setSelectedImage(getRandomImage())
  }, [getRandomImage])

  const refreshImage = useCallback(() => {
    setSelectedImage(getRandomImage())
  }, [getRandomImage])

  return {
    selectedImage,
    refreshImage
  }
}