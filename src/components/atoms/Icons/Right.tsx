import React, { SVGProps } from "react";
import { IconSize, IIconProps } from "./types";
import { styles } from "./helpers";

export const IconRight: React.FC<IIconProps> = ({
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
      <g
        clipPath="url(#clip0_461_7819)"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 12H5M12 19l7-7-7-7" />
      </g>
      <defs>
        <clipPath id="clip0_461_7819">
          <path fill="currentColor" d="M0 0H24V24H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default IconRight;
