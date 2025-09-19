import React, { SVGProps } from 'react'
import { IconSize, IIconProps } from './types'
import { styles } from './helpers'

export const IconVerifyCheck: React.FC<IIconProps> = ({ size = IconSize.md, className }) => {
  return (
    <svg
      width={100}
      height={100}
      viewBox='0 0 100 100'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={styles(size, className)}
    >
      <path
        d='M62.5 79.166c0-9.204-11.193-16.666-25-16.666s-25 7.462-25 16.666m75-37.5L70.833 58.334 62.5 50m-25 0c-9.205 0-16.667-7.462-16.667-16.667 0-9.205 7.462-16.666 16.667-16.666 9.205 0 16.667 7.461 16.667 16.666S46.705 50 37.5 50z'
        stroke='#F0BC5B'
        strokeWidth={8.33333}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default IconVerifyCheck
