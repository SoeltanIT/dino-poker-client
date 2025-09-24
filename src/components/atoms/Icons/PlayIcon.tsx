import React from 'react'
import { IconSize, IIconProps } from './types'
import { styles } from './helpers'

export function PlayIcon({ size = IconSize.md, className }: IIconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='42'
      height='42'
      viewBox='0 0 42 42'
      fill='none'
      className={styles(size, className)}
    >
      <g filter='url(#filter0_d_2447_7313)'>
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M21 33.8C24.3948 33.8 27.6505 32.4514 30.051 30.0509C32.4514 27.6505 33.8 24.3947 33.8 21C33.8 17.6052 32.4514 14.3495 30.051 11.949C27.6505 9.54852 24.3948 8.19995 21 8.19995C17.6052 8.19995 14.3495 9.54852 11.949 11.949C9.54858 14.3495 8.20001 17.6052 8.20001 21C8.20001 24.3947 9.54858 27.6505 11.949 30.0509C14.3495 32.4514 17.6052 33.8 21 33.8ZM20.288 16.4688C20.0471 16.308 19.767 16.2156 19.4776 16.2016C19.1883 16.1875 18.9006 16.2523 18.6452 16.389C18.3898 16.5256 18.1763 16.729 18.0274 16.9775C17.8786 17.226 17.8 17.5103 17.8 17.8V24.2C17.8 24.4896 17.8786 24.7739 18.0274 25.0224C18.1763 25.2709 18.3898 25.4743 18.6452 25.611C18.9006 25.7476 19.1883 25.8124 19.4776 25.7983C19.767 25.7843 20.0471 25.6919 20.288 25.5312L25.088 22.3312C25.3071 22.185 25.4868 21.9871 25.6111 21.7549C25.7354 21.5226 25.8004 21.2633 25.8004 21C25.8004 20.7366 25.7354 20.4773 25.6111 20.245C25.4868 20.0128 25.3071 19.8149 25.088 19.6688L20.288 16.4688Z'
          fill='white'
        />
      </g>
      <defs>
        <filter
          id='filter0_d_2447_7313'
          x='0.200012'
          y='0.199951'
          width='41.6'
          height='41.6'
          filterUnits='userSpaceOnUse'
          colorInterpolationFilters='sRGB'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feOffset />
          <feGaussianBlur stdDeviation='4' />
          <feComposite in2='hardAlpha' operator='out' />
          <feColorMatrix type='matrix' values='0 0 0 0 0.0601513 0 0 0 0 0.0667882 0 0 0 0 0.19289 0 0 0 0.24 0' />
          <feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow_2447_7313' />
          <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow_2447_7313' result='shape' />
        </filter>
      </defs>
    </svg>
  )
}
