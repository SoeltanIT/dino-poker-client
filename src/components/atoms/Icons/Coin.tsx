import React, { SVGProps } from "react";
import { IconSize, IIconProps } from "./types";
import { styles } from "./helpers";

export const IconCoin: React.FC<IIconProps> = ({
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
      <path
        d="M19 6.5C19 7.88 15.866 9 12 9S5 7.88 5 6.5m14 0C19 5.12 15.866 4 12 4S5 5.12 5 6.5m14 0v12c0 1.38-3.134 2.5-7 2.5s-7-1.12-7-2.5v-12m14 4c0 1.38-3.134 2.5-7 2.5s-7-1.12-7-2.5m14 4c0 1.38-3.134 2.5-7 2.5s-7-1.12-7-2.5"
        stroke="currentColor"
        strokeWidth={2}
      />
    </svg>
  );
};

export default IconCoin;
