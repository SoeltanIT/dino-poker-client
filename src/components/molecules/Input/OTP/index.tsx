"use client";

import { Input } from "@/components/ui/input";
import { useRef } from "react";

interface OtpInputProps {
  length?: number;
  onChange?: (code: string) => void;
}

export default function OtpInput({ length = 6, onChange }: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newValues = inputsRef.current
      .map((input) => input?.value || "")
      .join("");
    onChange?.(newValues);

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (
      e.key === "Backspace" &&
      !inputsRef.current[index]?.value &&
      index > 0
    ) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-around">
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="w-12 h-12 text-center text-lg bg-transparent text-app-text-color border border-app-neutral600 focus-visible:ring-1 focus-visible:ring-offset-1"
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}
    </div>
  );
}
