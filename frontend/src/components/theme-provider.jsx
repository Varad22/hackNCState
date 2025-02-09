"use client";

import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";

export default function ThemeContextProvider({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Ensures the theme loads on the client
  }, []);

  if (!mounted) {
    return <div className="opacity-0">{children}</div>; // Prevents mismatch during SSR
  }

  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
}
