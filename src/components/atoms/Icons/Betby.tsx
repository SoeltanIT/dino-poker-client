import React, { SVGProps } from 'react'
import { IconSize, IIconProps } from './types'
import { styles } from './helpers'

export const IconBetby: React.FC<IIconProps> = ({ size = IconSize.md, className }) => {
  return (
    <svg
      width={24}
      height={24}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={styles(size, className)}
    >
      <rect x={2} y={8} width={20} height={14} rx={5} stroke='currentColor' strokeWidth={2} />
      <path
        d='M12 7.5V7a1.5 1.5 0 00-1.5-1.5A1.5 1.5 0 019 4V3'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
      />
      <circle cx={18} cy={13.5} r={1.3} fill='currentColor' />
      <circle cx={16} cy={16.5} r={1.3} fill='currentColor' />
      <path d='M8 17v-4M6 15h4' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  )
}

export default IconBetby
