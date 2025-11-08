import React from 'react'
import { styles } from './helpers'
import { IconSize, IIconProps } from './types'

export const IconMenu: React.FC<IIconProps> = ({ size = IconSize.md, className }) => {
  return (
    <svg
      width={32}
      height={32}
      viewBox='0 0 32 32'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={styles(size, className)}
    >
      <path
        d='M4 8H28M4 16H28M4 24H28'
        stroke='currentColor'
        stroke-width='2.66667'
        stroke-linecap='round'
        stroke-linejoin='round'
      />
    </svg>
  )
}

export default IconMenu
