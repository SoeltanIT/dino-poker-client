import React from 'react';

import { cn } from '@/lib/utils';

import { IGameTagProps } from './types';
import { gameTagTextVariants, gameTagVariants } from './utils';

export const NewDropTag: React.FC<IGameTagProps> = ({ classname, variant }) => {
  return (
    <div className={classname}>
      <div className={cn(gameTagVariants({ variant }), 'relative')}>
        <svg
          className="h-full shrink-0 stroke-1 stroke-ds-grey-20op"
          style={{
            filter: 'drop-shadow(4px 2px 3px rgba(0, 0, 0, 0.20))',
          }}
          viewBox="0 0 83 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.57361e-06 6L0 30C1.44847e-07 26.6863 2.68629 24 6 24H81.5296C82.1782 24 82.5299 23.6875 82.7747 23.1856C82.9548 22.8164 82.9331 22.3866 82.8084 21.9952L79.9958 13.1685C79.8772 12.7962 79.8136 12.3907 79.8136 12V12V12C79.8136 11.6093 79.8772 11.2038 79.9958 10.8315L82.8084 2.0048C82.9331 1.61341 82.9548 1.18356 82.7747 0.814377C82.5299 0.312491 82.1782 9.25727e-07 81.5296 8.97378e-07L6 0C2.68629 -1.44847e-07 1.71846e-06 2.68629 1.57361e-06 6Z"
            fill="url(#paint0_linear_38_970)"
          />
          <path
            d="M6 0.5H81.5293C81.7684 0.5 81.914 0.556239 82.0156 0.62793C82.1232 0.703978 82.2251 0.828213 82.3252 1.0332C82.43 1.24798 82.433 1.53555 82.332 1.85254L79.5195 10.6797C79.3854 11.1005 79.3135 11.5573 79.3135 12C79.3135 12.4427 79.3854 12.8995 79.5195 13.3203L82.332 22.1475C82.433 22.4645 82.43 22.752 82.3252 22.9668C82.2251 23.1718 82.1232 23.296 82.0156 23.3721C81.914 23.4438 81.7684 23.5 81.5293 23.5H6C3.68309 23.5 1.65101 24.7133 0.5 26.5381V6C0.5 2.96243 2.96243 0.500001 6 0.5Z"
            stroke="white"
            strokeOpacity="0.12"
          />
          <defs>
            <linearGradient
              id="paint0_linear_38_970"
              x1="80"
              y1="19"
              x2="-4.5"
              y2="19"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.128773" stopColor="#BC63FC" />
              <stop offset="0.79481" stopColor="#636BFC" />
              <stop offset="0.87049" stopColor="#4E39D7" />
              <stop offset="0.918728" stopColor="#2A3193" />
            </linearGradient>
          </defs>
        </svg>

        <span
          className={gameTagTextVariants({
            variant,
            color: 'white',
          })}
        >
          New Drop
        </span>
      </div>
    </div>
  );
};
