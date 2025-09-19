import clsx from 'clsx';
import { IconSize } from './types';

export const styles = (size = IconSize.md, className: string = '') => {
  return clsx(
    'relative w-[1em] h-[1em]',
    {
      'text-[0.5rem]': size === IconSize['3xs'],
      'text-[0.75rem]': size === IconSize['2xs'],
      'text-[1rem]': size === IconSize.xs,
      'text-[1.125rem]': size === IconSize.sm,
      'text-[1.25rem] lg:text-[1.5rem]': size === IconSize.md,
      'text-[1.5rem] lg:text-[2rem]': size === IconSize.lg,
      'text-[3rem]': size === IconSize.xl,
      'text-[4.25rem]': size === IconSize['2xl'],
      'text-[5rem] lg:text-[6.25rem]': size === IconSize['3xl'],
    },
    className
  );
}