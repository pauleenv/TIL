"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EntryCardWrapperProps extends React.ComponentProps<typeof Card> {
  children: React.ReactNode;
  className?: string;
}

const EntryCardWrapper: React.FC<EntryCardWrapperProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn(
      "bg-white border-2 border-black rounded-[16px] shadow-custom-black-lg", // Apply all visual styles to the wrapper div
      className
    )}>
      <Card
        className="p-0 shadow-none border-none bg-transparent" // Strip conflicting styles from the Card
        {...props}
      >
        {children}
      </Card>
    </div>
  );
};

export default EntryCardWrapper;