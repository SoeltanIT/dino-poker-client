// /components/atoms/ImgFade.tsx
'use client'
import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import clsx from 'clsx'

export default function ImgFade({ className, onLoadingComplete, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false)
  return (
    <>
      {/* skeleton background */}
      {!loaded && <div className='absolute inset-0 animate-pulse bg-muted' />}
      <Image
        {...props}
        className={clsx('transition-opacity duration-300', loaded ? 'opacity-100' : 'opacity-0', className)}
        onLoadingComplete={img => {
          setLoaded(true)
          onLoadingComplete?.(img)
        }}
      />
    </>
  )
}
