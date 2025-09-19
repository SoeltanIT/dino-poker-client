import React, { SVGProps } from "react";
import { IconSize, IIconProps } from "./types";
import { styles } from "./helpers";

export const IconPassword: React.FC<IIconProps> = ({
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
        x={4}
        y={9}
        width={16}
        height={12}
        rx={4}
        stroke="currentColor"
        strokeWidth={2}
      />
      <path
        d="M12 16v-2"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 9V7a4 4 0 00-4-4v0a4 4 0 00-4 4v2"
        stroke="currentColor"
        strokeWidth={2}
      />
    </svg>
  );
};

export default IconPassword;
