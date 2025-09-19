import React, { SVGProps } from "react";
import { IconSize, IIconProps } from "./types";
import { styles } from "./helpers";

export const IconDeposit: React.FC<IIconProps> = ({
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
        d="M15.375 12H12m0 0H8.625M12 12v3.374M12 12V8.624m9-2.249v11.25A3.375 3.375 0 0117.625 21H6.375A3.375 3.375 0 013 17.625V6.375A3.375 3.375 0 016.375 3h11.25A3.375 3.375 0 0121 6.375z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default IconDeposit;
