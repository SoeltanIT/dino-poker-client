import React, { SVGProps } from 'react'
import { IconSize, IIconProps } from './types'
import { styles } from './helpers'

export const IconGiftReferral: React.FC<IIconProps> = ({ size = IconSize.md, className }) => {
  return (
    <svg width={112} height={49} viewBox='0 0 112 49' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <mask
        id='a'
        style={{
          maskType: 'alpha'
        }}
        maskUnits='userSpaceOnUse'
        x={0}
        y={0}
        width={112}
        height={49}
      >
        <path fill='url(#paint0_linear_1177_31757)' d='M0 0H112V49H0z' />
      </mask>
      <g mask='url(#a)' stroke='#31EEAB' strokeLinejoin='round'>
        <path
          d='M94.823 6.4l1.83 4.947 4.947 1.83-4.946 1.83-1.83 4.946-1.83-4.946-4.947-1.83 4.946-1.83 1.83-4.947zM86.353 17.695l1.599 2.354 2.354 1.599-2.354 1.598-1.6 2.354-1.598-2.354-2.354-1.598 2.354-1.6 1.599-2.353z'
          strokeWidth={2}
        />
        <path
          d='M26 40.288V27.997a5.6 5.6 0 015.6-5.6h33.6a5.6 5.6 0 015.6 5.6v12.291m-44.8 0h44.8m-44.8 0v12.908a5.6 5.6 0 005.6 5.6h33.6a5.6 5.6 0 005.6-5.6V40.288M48.808 58.796v-36.4m-2.824-1.178c.419-.018.807-.238 1.015-.6.209-.36.205-.806.01-1.178-.743-1.355-3.352-5.86-5.054-6.843-2.121-1.225-4.846-.502-6.064 1.608-1.219 2.11-.483 4.832 1.639 6.057 1.73.999 6.908.99 8.454.956zm3.897-1.778c-.195.371-.197.817.011 1.178.208.362.596.582 1.015.6 1.546.033 6.752.026 8.454-.957 2.122-1.224 2.858-3.945 1.64-6.056-1.219-2.11-3.944-2.833-6.065-1.609-1.73 1-4.311 5.489-5.055 6.844z'
          strokeWidth={4.66667}
          strokeLinecap='round'
        />
      </g>
      <defs>
        <linearGradient
          id='paint0_linear_1177_31757'
          x1={0}
          y1={0}
          x2={116.757}
          y2={31.1928}
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#5F32E7' />
          <stop offset={1} stopColor='#9747FF' />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default IconGiftReferral
