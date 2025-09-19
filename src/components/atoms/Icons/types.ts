export enum IconSize {
  '3xs' = '3xs',
  '2xs' = '2xs',
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  '2xl' = '2xl',
  '3xl' = '3xl'
}

export interface IIconProps {
  className?: string
  size?: IconSize
  theme?: string
}

export type TIcon = React.FC<IIconProps>

export enum IconStarVariant {
  default = 'default',
  filled = 'filled',
  active = 'active'
}

export interface IIconStarProps {
  variant?: keyof typeof IconStarVariant
  className?: string
}

export enum IconBellVariant {
  default = 'default',
  filled = 'filled',
  active = 'active',
  active_filled = 'active_filled'
}

export interface IIconBellProps {
  variant?: keyof typeof IconBellVariant
  className?: string
}
