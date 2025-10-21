import React from 'react'
import { styles } from './helpers'
import { IconSize, IIconProps } from './types'

export const IconChips: React.FC<IIconProps> = ({ size = IconSize.md, className }) => {
  return (
    <svg
      width={12}
      height={12}
      viewBox='0 0 12 12'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={styles(size, className)}
    >
      <path d='M10.8 6a4.8 4.8 0 11-9.6 0 4.8 4.8 0 019.6 0z' stroke='currentColor' />
      <path
        d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM6 1.5V3M6 9v2M1 6h2M9 6h2M8.5 4l1.217-1.228M4 4L2.5 2.772M9.552 9.331l-1.5-1.5M2.5 9.331L4 8'
        stroke='currentColor'
      />
    </svg>
  )
}

export default IconChips
