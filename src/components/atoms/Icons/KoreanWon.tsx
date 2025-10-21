import React from 'react'
import { styles } from './helpers'
import { IconSize, IIconProps } from './types'

export const IconKoreanWon: React.FC<IIconProps> = ({ size = IconSize.md, className }) => {
  return (
    <svg
      width={13}
      height={13}
      viewBox='0 0 13 13'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={styles(size, className)}
    >
      <path
        d='M11 6.5A4.5 4.5 0 116.5 2c1.26 0 2.465.5 3.37 1.37L11 4.5M11 2v2.5'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M4.186 5.915L3.897 4.84h.719l.73 2.72.73-2.72h.847l.73 2.72.731-2.72h.719l-.289 1.074H9.5v.716h-.878l-.128.477H9.5v.716H8.302l-.225.835H7.23L6.5 5.94l-.73 2.72h-.847l-.225-.835H3.5v-.716h1.006l-.128-.477H3.5v-.716h.686z'
        fill='currentColor'
      />
    </svg>
  )
}

export default IconKoreanWon
