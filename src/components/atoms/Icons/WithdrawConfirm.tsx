import React, { SVGProps } from 'react'
import { IconSize, IIconProps } from './types'
import { styles } from './helpers'

export const IconWithdrawConfirm: React.FC<IIconProps> = ({ size = IconSize.md, className }) => {
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
        d='M29.167 50L49.79 70.624 93.989 26.43M8.54 50.21l20.624 20.623M73.359 26.64L51.262 48.737'
        stroke='#31EEAB'
        strokeWidth={8.33333}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default IconWithdrawConfirm
