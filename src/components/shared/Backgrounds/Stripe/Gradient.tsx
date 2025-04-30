"use client";

import { useEffect, useRef } from "react";
import { Gradient } from "./normalizeColor";

export default function GradientBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Set CSS variables for gradient colors
    document.documentElement.style.setProperty("--gradient-color-1", "#efefff");
    document.documentElement.style.setProperty("--gradient-color-2", "#383b40");
    document.documentElement.style.setProperty("--gradient-color-3", "#efefff");
    document.documentElement.style.setProperty("--gradient-color-4", "#efefff");

    // Initialize the gradient
    const gradient = new Gradient();
    canvasRef.current.style.width = "100%";
    canvasRef.current.style.height = "100%";

    // Use the initGradient method to set up the canvas
    gradient.initGradient("#gradient-canvas");

    // Clean up
    return () => {
      document.documentElement.style.removeProperty("--gradient-color-1");
      document.documentElement.style.removeProperty("--gradient-color-2");
      document.documentElement.style.removeProperty("--gradient-color-3");
      document.documentElement.style.removeProperty("--gradient-color-4");
    };
  }, []);

  return (
    <div className="w-full flex items-center justify-center bg-hero">
      <div className="relative w-full h-full">
        <canvas
          id="gradient-canvas"
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          data-js-darken-top=""
        />
        {children}
      </div>
    </div>
  );
}
