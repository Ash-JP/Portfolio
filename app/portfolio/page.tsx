"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MinimalistLayout } from "@/components/MinimalistLayout";
import { CreativeLayout } from "@/components/CreativeLayout";

export default function Portfolio() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (theme === "creative") {
    return <CreativeLayout />;
  }

  // Default to minimalist if no theme or explicitly set
  return <MinimalistLayout />;
}
