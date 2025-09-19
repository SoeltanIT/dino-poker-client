import React, { SVGProps } from "react";
import { IconSize, IIconProps } from "./types";
import { styles } from "./helpers";

export const IconWithdrawal: React.FC<IIconProps> = ({
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
        d="M17 9l-5-5m0 0L7 9m5-5v13M6 20h12"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconWithdrawal;
