import React, { SVGProps } from "react";
import { IconSize, IIconProps } from "./types";
import { styles } from "./helpers";

export const IconLiveChat: React.FC<IIconProps> = ({
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
        d="M19 11a7 7 0 10-14 0m11 3.5v2c0 .465 0 .697.038.89a2 2 0 001.572 1.572c.193.038.425.038.89.038s.697 0 .89-.038a2 2 0 001.571-1.572c.039-.193.039-.425.039-.89v-2c0-.465 0-.697-.039-.89a2 2 0 00-1.57-1.572C19.196 12 18.964 12 18.5 12s-.697 0-.89.038a2 2 0 00-1.572 1.571c-.038.194-.038.426-.038.891zm-8 0v2c0 .465 0 .697-.039.89a2 2 0 01-1.57 1.572C6.196 19 5.964 19 5.5 19s-.697 0-.89-.038a2 2 0 01-1.572-1.572C3 17.197 3 16.965 3 16.5v-2c0-.465 0-.697.038-.89a2 2 0 011.572-1.572C4.803 12 5.035 12 5.5 12s.697 0 .89.038a2 2 0 011.571 1.571c.039.194.039.426.039.891z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconLiveChat;
