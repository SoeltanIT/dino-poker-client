import React, { SVGProps } from 'react'
import { IconSize, IIconProps } from './types'
import { styles } from './helpers'

export const IconPromotion: React.FC<IIconProps> = ({ size = IconSize.md, className }) => {
  return (
    <svg
      width={24}
      height={24}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={styles(size, className)}
    >
      <path
        d='M8.4 15.6l7.2-7.2m-6.646.55l-.014-.015m6.124 6.188l-.014-.015M21.6 12a9.6 9.6 0 11-19.2 0 9.6 9.6 0 0119.2 0z'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
      />
    </svg>
  )
}

export default IconPromotion
