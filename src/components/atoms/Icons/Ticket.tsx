import React, { SVGProps } from 'react'
import { IconSize, IIconProps } from './types'
import { styles } from './helpers'

export const IconTicket: React.FC<IIconProps> = ({ size = IconSize.md, className }) => {
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
        d='M18 20v1-1zM2 8H1h1zm4-4V3v1zM2.315 9.636l-.326.945.326-.945zm0 4.727l.326.946-.326-.946zm19.37 0l.326-.945-.326.945zm0-4.727l-.326-.946.326.946zM18 4v1a3 3 0 013 3h2a5 5 0 00-5-5v1zm4 4h-1v1.223h2V8h-1zm-.315 1.636l-.326-.946A3.501 3.501 0 0019 12h2c0-.656.421-1.216 1.01-1.419l-.325-.945zM20 12h-1a3.5 3.5 0 002.359 3.309l.326-.946.326-.945A1.5 1.5 0 0121 12h-1zm2 2.776h-1V16h2v-1.224h-1zM22 16h-1a3 3 0 01-3 3v2a5 5 0 005-5h-1zm-4 4v-1H6v2h12v-1zM6 20v-1a3 3 0 01-3-3H1a5 5 0 005 5v-1zm-4-4h1v-1.224H1V16h1zm.315-1.637l.326.946A3.5 3.5 0 005 12H3a1.5 1.5 0 01-1.01 1.418l.325.945zM4 12h1a3.501 3.501 0 00-2.359-3.31l-.326.946-.326.945C2.58 10.784 3 11.344 3 12h1zM2 9.223h1V8H1v1.223h1zM2 8h1a3 3 0 013-3V3a5 5 0 00-5 5h1zm4-4v1h12V3H6v1zM2.315 9.636l.326-.946A.553.553 0 013 9.223H1c0 .69.48 1.183.99 1.358l.325-.945zM2 14.776h1c0 .31-.21.481-.359.533l-.326-.946-.326-.945c-.508.175-.989.668-.989 1.358h1zm19.685-.413l-.326.946a.553.553 0 01-.359-.533h2c0-.69-.48-1.183-.99-1.358l-.325.945zM22 9.223h-1c0-.31.21-.481.359-.533l.326.946.326.945c.508-.175.989-.667.989-1.358h-1z'
        fill='currentColor'
      />
      <path
        d='M15 7V4M15 13.5v-3M15 20v-3'
        stroke='currentColor'
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default IconTicket
