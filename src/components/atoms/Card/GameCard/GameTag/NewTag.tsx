import React from 'react';

import { cn } from '@/lib/utils';

import { IGameTagProps } from './types';
import { gameTagTextVariants, gameTagVariants } from './utils';

export const NewTag: React.FC<IGameTagProps> = ({ classname, variant }) => {
  return (
    <div className={classname}>
      <div className={cn(gameTagVariants({ variant }), 'relative')}>
        <svg
          className="h-full shrink-0 stroke-1 stroke-ds-grey-20op"
          style={{
            filter: 'drop-shadow(4px 2px 3px rgba(0, 0, 0, 0.20))',
          }}
          viewBox="0 0 48 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.57361e-06 6L0 30C1.44847e-07 26.6863 2.68629 24 6 24H46.5296C47.1782 24 47.5299 23.6875 47.7747 23.1856C47.9548 22.8164 47.9331 22.3866 47.8084 21.9952L44.9958 13.1685C44.8772 12.7962 44.8136 12.3907 44.8136 12V12V12C44.8136 11.6093 44.8772 11.2038 44.9958 10.8315L47.8084 2.0048C47.9331 1.61341 47.9548 1.18356 47.7747 0.814377C47.5299 0.312491 47.1782 9.25727e-07 46.5296 8.97378e-07L6 0C2.68629 -1.44847e-07 1.71846e-06 2.68629 1.57361e-06 6Z"
            fill="url(#paint0_linear_37_994)"
          />
          <path
            d="M6 0.5H46.5293C46.7684 0.5 46.914 0.556239 47.0156 0.62793C47.1232 0.703978 47.2251 0.828213 47.3252 1.0332C47.43 1.24798 47.433 1.53555 47.332 1.85254L44.5195 10.6797C44.3854 11.1005 44.3135 11.5573 44.3135 12C44.3135 12.4427 44.3854 12.8995 44.5195 13.3203L47.332 22.1475C47.433 22.4645 47.43 22.752 47.3252 22.9668C47.2251 23.1718 47.1232 23.296 47.0156 23.3721C46.914 23.4438 46.7684 23.5 46.5293 23.5H6C3.68309 23.5 1.65101 24.7133 0.5 26.5381V6C0.5 2.96243 2.96243 0.500001 6 0.5Z"
            stroke="white"
            strokeOpacity="0.2"
          />
          <defs>
            <linearGradient
              id="paint0_linear_37_994"
              x1="22"
              y1="19"
              x2="-4.5"
              y2="19"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.174297" stopColor="#95FF24" />
              <stop offset="0.653833" stopColor="#5BED00" />
              <stop offset="0.918728" stopColor="#2F8C00" />
            </linearGradient>
          </defs>
        </svg>

        <span
          className={gameTagTextVariants({
            variant,
          })}
        >
          New
        </span>
      </div>
    </div>
  );
};
