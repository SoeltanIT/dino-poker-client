import { cva } from 'class-variance-authority';

export const gameTagVariants = cva('shrink-0', {
  variants: {
    variant: {
      large: 'h-[45.733px]',
      big: 'h-[30px]',
      main: 'h-[30px]',
      provider: 'h-[30px]',
    },
  },
  defaultVariants: {
    variant: 'main',
  },
});

export const gameTagTextVariants = cva(
  'font-extrabold leading-none uppercase absolute',
  {
    variants: {
      variant: {
        large: 'text-[18.293px] tracking-[-0.366px] top-[9.15px] left-[10px]',
        big: 'text-xs tracking-[-0.24px] top-[6px] left-2',
        main: 'text-xs tracking-[-0.24px] top-[6px] left-2',
        provider: 'text-xs tracking-[-0.24px] top-[6px] left-2',
      },

      color: {
        black: 'text-black',
        white: 'text-dark',
      },
    },
    defaultVariants: {
      variant: 'main',
      color: 'black',
    },
  },
);
