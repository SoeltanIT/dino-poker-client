import React from 'react'
import { styles } from './helpers'
import { IconSize, IIconProps } from './types'

export const IconCasino: React.FC<IIconProps> = ({ size = IconSize.md, className }) => {
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
        d='M12 10H4a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-8a2 2 0 00-2-2zM17.92 14l3.5-3.5a2.24 2.24 0 000-3l-5-4.92a2.24 2.24 0 00-3 0L10 6M6 18h.01M10 14h.01M15 6h.01M18 9h.01'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default IconCasino
