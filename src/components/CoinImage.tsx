'use client'

import { useState } from 'react'
import Image from 'next/image'

interface CoinImageProps {
  src: string
  alt?: string
  name?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const DEFAULT_IMAGE = 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'

const CoinImage: React.FC<CoinImageProps> = ({ 
  src, 
  alt,
  name, 
  size = 'md',
  className = ''
}) => {
  const [error, setError] = useState(false)
  const [imageSrc, setImageSrc] = useState(src)

  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const handleError = () => {
    setError(true)
    setImageSrc(DEFAULT_IMAGE)
  }

  return (
    <Image
      src={error ? DEFAULT_IMAGE : imageSrc}
      alt={alt || name || 'Kripto para birimi'}
      width={48}
      height={48}
      className={`${sizeMap[size]} ${className}`}
      onError={handleError}
    />
  )
}

export default CoinImage 