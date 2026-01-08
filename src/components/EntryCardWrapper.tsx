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
        "bg-white border-2 border-black shadow-custom-black-lg rounded-[16px]",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
};

export default EntryCardWrapper;