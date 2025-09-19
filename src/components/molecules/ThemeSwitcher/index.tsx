"use client";

import { useHasMounted } from "@/utils/hooks/useHasMounted";
import { useThemeToggle } from "@/utils/hooks/useTheme";
import { Moon, Sun } from "lucide-react";

export default function ThemeSwitcher({ lang }: { lang?: any }) {
  // This prevents hydration error
  const hasMounted = useHasMounted();
  const { theme, toggleTheme } = useThemeToggle(); // Safe to call now
  return (
    hasMounted && (
      <div
        className='min-w-10 min-h-10 hover:bg-app-bg-button-hover rounded-lg flex items-center justify-center cursor-pointer'
        onClick={toggleTheme}
      >
        {theme === 'dark' ? (
          <Sun className='h-5 w-5 transition-all duration-300 text-app-text-color' />
        ) : (
          <Moon className='h-5 w-5 transition-all duration-300 text-app-text-color' />
        )}
      </div>
    )
  )
}
