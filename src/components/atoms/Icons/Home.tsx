import React, { SVGProps } from "react";
import { IconSize, IIconProps } from "./types";
import { styles } from "./helpers";

export const IconHome: React.FC<IIconProps> = ({
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
        d="M3 9.416c0-.37.188-.716.505-.93l7.8-5.275a1.25 1.25 0 011.39 0l7.8 5.275c.317.214.505.56.505.93v9.872c0 .946-.806 1.712-1.8 1.712H4.8c-.994 0-1.8-.766-1.8-1.712V9.416z"
        stroke="currentColor"
        strokeWidth={2}
      />
      <path
        d="M14.25 13.125a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
        stroke="currentColor"
        strokeWidth={2}
      />
    </svg>
  );
};

export default IconHome;
