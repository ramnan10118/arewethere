'use client'

import Image from 'next/image'
import { useState } from 'react'

interface SafeImageProps {
  src: string
  alt: string
  fallbackSrc?: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
  priority?: boolean
}

export function SafeImage({ 
  src, 
  alt, 
  fallbackSrc = '/images/garage/AckoGarage.png',
  fill,
  width,
  height,
  className,
  style,
  priority
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true)
      setImgSrc(fallbackSrc)
    }
  }

  const imageProps = {
    src: imgSrc,
    alt,
    onError: handleError,
    className,
    style,
    priority
  }

  if (fill) {
    return <Image {...imageProps} fill alt={alt} />
  }

  return (
    <Image 
      {...imageProps}
      width={width || 100}
      height={height || 100}
      alt={alt}
    />
  )
}