"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ChokbarometerProps {
  level: "Intéressant" | "Surprenant" | "Incroyable" | "Chokbar";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Chokbarometer: React.FC<ChokbarometerProps> = ({ 
  level, 
  size = "md",
  className 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "sm": return "w-6 h-6";
      case "lg": return "w-12 h-12";
      default: return "w-8 h-8";
    }
  };

  const getChokbarLevel = () => {
    switch (level) {
      case "Intéressant": return { emoji: "chokbar-1.svg", label: "Intéressant" };
      case "Surprenant": return { emoji: "chokbar-2.svg", label: "Surprenant" };
      case "Incroyable": return { emoji: "chokbar-3.svg", label: "Incroyable" };
      case "Chokbar": return { emoji: "chokbar-4.svg", label: "Chokbar" };
      default: return { emoji: "chokbar-1.svg", label: "Intéressant" };
    }
  };

  const { emoji, label } = getChokbarLevel();

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <img 
        src={`/${emoji}`} 
        alt={label}
        className={cn(getSizeClasses(), "object-contain")}
        aria-label={label}
      />
      <span className="text-xs mt-1 text-center">{label}</span>
    </div>
  );
};

export default Chokbarometer;