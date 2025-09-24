import React from 'react';

import { cn } from '@/lib/utils';

import { IGameTagProps } from './types';
import { gameTagTextVariants, gameTagVariants } from './utils';

export const JackpotTag: React.FC<IGameTagProps> = ({ classname, variant }) => {
  return (
    <div className={classname}>
      <div className={cn(gameTagVariants({ variant }), 'relative')}>
        <svg
          className="h-full shrink-0 stroke-1 stroke-ds-grey-20op"
          style={{
            filter: 'drop-shadow(4px 2px 3px rgba(0, 0, 0, 0.20))',
          }}
          viewBox="0 0 58 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.30385e-06 4.8L0 24C1.20016e-07 21.349 2.22578 19.2 4.97143 19.2H56.7817C57.2594 19.2 57.5428 19.0024 57.7423 18.6764C57.9641 18.3142 57.9282 17.8598 57.7951 17.4565L55.5104 10.5335C55.4126 10.237 55.3598 9.91215 55.3598 9.6V9.6V9.6C55.3598 9.28785 55.4126 8.96298 55.5104 8.66655L57.7951 1.74351C57.9282 1.34017 57.9641 0.885833 57.7423 0.523587C57.5428 0.197596 57.2594 7.38065e-07 56.7817 7.17902e-07L4.97143 0C2.22579 -1.15877e-07 1.42386e-06 2.14903 1.30385e-06 4.8Z"
            fill="url(#paint0_linear_36_1350)"
          />
          <path
            d="M4.97168 0.5H56.7812C56.9489 0.5 57.0494 0.534122 57.1152 0.572266C57.182 0.610945 57.2478 0.673783 57.3154 0.78418C57.4248 0.962764 57.4343 1.24165 57.3203 1.58691L55.0352 8.50977C54.9209 8.8561 54.8594 9.23382 54.8594 9.59961C54.8594 9.96553 54.9208 10.344 55.0352 10.6904L57.3203 17.6133C57.4342 17.9585 57.4247 18.2365 57.3154 18.415C57.2476 18.5258 57.1821 18.5892 57.1152 18.6279C57.0494 18.6661 56.9488 18.7002 56.7812 18.7002H4.97168C3.13138 18.7002 1.49351 19.5842 0.5 20.9453V4.7998C0.50011 2.44146 2.48556 0.5 4.97168 0.5Z"
            stroke="white"
            strokeOpacity="0.2"
          />
          <defs>
            <linearGradient
              id="paint0_linear_36_1350"
              x1="18.2286"
              y1="15.2"
              x2="-3.72857"
              y2="15.2"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.174297" stopColor="#FFF024" />
              <stop offset="0.653833" stopColor="#EDC100" />
              <stop offset="0.918728" stopColor="#8C7200" />
            </linearGradient>
          </defs>
        </svg>

        <span
          className={gameTagTextVariants({
            variant,
          })}
        >
          Jackpot
        </span>
      </div>
    </div>
  );
};
