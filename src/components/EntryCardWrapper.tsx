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
    <Card
      className={cn(
        "bg-white border-2 border-black rounded-[16px] shadow-xl", // Temporarily changed to shadow-xl for diagnosis
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
};

export default EntryCardWrapper;