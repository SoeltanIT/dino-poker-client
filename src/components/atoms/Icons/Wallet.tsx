import React, { SVGProps } from "react";
import { IconSize, IIconProps } from "./types";
import { styles } from "./helpers";

export const IconWallet: React.FC<IIconProps> = ({
  size = IconSize.md,
  className,
}) => {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles(size, className)}
    >
      <rect
        x={2}
        y={6}
        width={20}
        height={16}
        rx={5}
        stroke="currentColor"
        strokeWidth={2}
      />
      <path
        d="M19 6.5v0a3.668 3.668 0 00-4.408-3.593l-8.6 1.771A5 5 0 002 9.575V13"
        stroke="currentColor"
        strokeWidth={2}
      />
      <path
        d="M6 17.5h6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 14a2.5 2.5 0 012.5-2.5H22v5h-4.5A2.5 2.5 0 0115 14v0z"
        stroke="currentColor"
        strokeWidth={2}
      />
      <path
        d="M17.5 14h.2"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconWallet;
