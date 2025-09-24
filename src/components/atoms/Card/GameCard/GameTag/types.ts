import { VariantProps } from 'class-variance-authority';

import { gameTagVariants } from './utils';

export interface IGameTagProps {
  classname?: string;
  variant: VariantProps<typeof gameTagVariants>['variant'];
}
