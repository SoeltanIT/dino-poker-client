import React, { SVGProps } from 'react'
import { IconSize, IIconProps } from './types'
import { styles } from './helpers'

export const IconAlert: React.FC<IIconProps> = ({ size = IconSize.md, className }) => {
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
        d='M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 12.336a1 1 0 00-1 1v.039a1 1 0 102 0v-.04a1 1 0 00-1-1zM12 6.5a1 1 0 00-1 1V12a1 1 0 102 0V7.5a1 1 0 00-1-1z'
        fill='currentColor'
      />
    </svg>
  )
}

export default IconAlert
