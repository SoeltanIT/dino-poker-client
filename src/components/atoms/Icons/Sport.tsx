import React from 'react'
import { styles } from './helpers'
import { IconSize, IIconProps } from './types'

export const IconSport: React.FC<IIconProps> = ({ size = IconSize.md, className }) => {
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
        d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10 10-4.477 10-10z'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M12 2v20M2.005 12.005h20M5 5s3 1.5 3 7-3 7.5-3 7.5M19 5s-3 1.5-3 7 3 7.5 3 7.5'
        stroke='currentColor'
        strokeWidth={2}
      />
    </svg>
  )
}

export default IconSport
