import React, { SVGProps } from 'react'
import { IconSize, IIconProps } from './types'
import { styles } from './helpers'

export const IconReferral: React.FC<IIconProps> = ({ size = IconSize.md, className }) => {
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
        d='M17 20c0-1.657-2.239-3-5-3s-5 1.343-5 3m14-3c0-1.23-1.234-2.287-3-2.75M3 17c0-1.23 1.234-2.287 3-2.75m12-4.014a3 3 0 10-4-4.472m-8 4.472a3 3 0 014-4.472M12 14a3 3 0 110-6 3 3 0 010 6z'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default IconReferral
