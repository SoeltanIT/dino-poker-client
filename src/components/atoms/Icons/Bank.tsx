import React, { SVGProps } from "react";
import { IconSize, IIconProps } from "./types";
import { styles } from "./helpers";

export const IconBank: React.FC<IIconProps> = ({
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
        d="M3 19h18m-9-7v7m6-7v7M6 12v7m6.447-15.776l8.143 4.071c.85.425.547 1.705-.402 1.705H3.811c-.95 0-1.251-1.28-.402-1.705l8.143-4.071a1 1 0 01.894 0z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconBank;
