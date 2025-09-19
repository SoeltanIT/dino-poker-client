"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface DepositModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, children }: DepositModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);

      // Reset animate first to ensure consistent transition
      setAnimate(false);

      // Force reflow before setting animate to true
      requestAnimationFrame(() => {
        void modalRef.current?.offsetWidth; // force reflow
        setAnimate(true);
      });
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[99] flex justify-end"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div
        ref={modalRef}
        className={`
          bg-app-background-primary w-[375px] md:w-[400px] fixed z-[101] transform transition-transform duration-300 ease-in-out
          ${animate ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {children}
      </div>
    </div>
  );
}
