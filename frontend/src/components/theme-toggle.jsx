"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  // Sync the toggle state with the theme
  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
    setIsDark(!isDark);
  };

  return (
    <label className="flex items-center cursor-pointer space-x-2">
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {isDark ? "Dark Mode" : "Light Mode"}
      </span>
      <div className="relative">
        <input
          type="checkbox"
          checked={isDark}
          onChange={toggleTheme}
          className="sr-only"
        />
        <div
          className="block w-10 h-6 bg-gray-300 rounded-full dark:bg-gray-600"
        ></div>
        <div
          className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transform transition ${
            isDark ? "translate-x-4" : ""
          }`}
        ></div>
      </div>
    </label>
  );
}
