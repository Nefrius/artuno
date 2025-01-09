'use client'

import { useState, memo, useEffect } from 'react'
import Image from 'next/image'

const DEFAULT_COIN_IMAGE = 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'

interface CoinImageProps {
  src?: string | null
  name: string
  size?: 'sm' | 'md'
}

const sizes = {
  sm: 32,
  md: 48
}

function CoinImage({ src, name, size = 'sm' }: CoinImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(DEFAULT_COIN_IMAGE)
  const dimension = sizes[size]

  useEffect(() => {
    if (src && typeof src === 'string' && src.trim() !== '') {
      setImageSrc(src)
    } else {
      setImageSrc(DEFAULT_COIN_IMAGE)
    }
  }, [src])

  return (
    <div style={{ width: dimension, height: dimension }}>
      <Image
        src={imageSrc}
        alt={name}
        width={dimension}
        height={dimension}
        className="rounded-full"
        onError={() => setImageSrc(DEFAULT_COIN_IMAGE)}
        priority
      />
    </div>
  )
}

export default memo(CoinImage) 