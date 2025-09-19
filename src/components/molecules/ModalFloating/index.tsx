"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface ModalFloatingProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  children: ReactNode;
  className?: string;
}

export const ModalFloating: React.FC<ModalFloatingProps> = ({
  isOpen,
  onClose,
  triggerRef,
  children,
  className,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => setAnimate(true));
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const clickedOutsideDropdown =
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node);
      const clickedOutsideTrigger =
        triggerRef.current && !triggerRef.current.contains(e.target as Node);

      if (clickedOutsideDropdown && clickedOutsideTrigger) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  if (!shouldRender) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 z-[99]"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div
        ref={dropdownRef}
        className={`
        w-[343px] absolute left-[80px] bottom-4 mt-2 bg-app-background-secondary text-white rounded-xl shadow-lg z-[101] border border-app-neutral600
        transition-all duration-200 ease-out origin-top-right
        ${animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
      ${className}`}
      >
        {children}
      </div>
    </div>
  );
};
