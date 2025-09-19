import React, { SVGProps } from 'react'
import { IconSize, IIconProps } from './types'
import { styles } from './helpers'

export const IconDPUniversal: React.FC<IIconProps> = ({ size = IconSize.md, className }) => {
  return (
    <svg
      width={28}
      height={28}
      viewBox='0 0 28 28'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={styles(size, className)}
    >
      <rect
        x={4.6665}
        y={10.7334}
        width={18.6667}
        height={14.9333}
        rx={4.66667}
        stroke='currentColor'
        strokeWidth={1.86667}
      />
      <path
        d='M4.667 17.267v-3.72a4.667 4.667 0 013.085-4.391l2.748-.99M17.5 7.583v0a3.692 3.692 0 014.2 3.657v.427M16.8 18.2a2.333 2.333 0 012.333-2.333h4.2v4.666h-4.2A2.333 2.333 0 0116.8 18.2v0z'
        stroke='currentColor'
        strokeWidth={1.86667}
      />
      <path
        d='M19.133 18.2h.187'
        stroke='currentColor'
        strokeWidth={1.86667}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M10.5 4.667l3.5 3.5m0 0l3.5-3.5m-3.5 3.5v-7'
        stroke='currentColor'
        strokeWidth={1.75}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default IconDPUniversal
