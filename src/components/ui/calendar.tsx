"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  datesWithNotes?: Map<string, string>; // Add this prop
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  datesWithNotes, // Destructure datesWithNotes
  ...props
}: CalendarProps) {

  const customModifiers: Record<string, Date[]> = {};
  const datesWithAnyNote: Date[] = [];
  const modifierClassNamesMap: Record<string, string> = {};

  if (datesWithNotes) {
    datesWithNotes.forEach((subject, dateString) => {
      const date = new Date(dateString);
      
      // The modifier name used internally by react-day-picker (no escaped slashes, just spaces replaced)
      const modifierKey = `has-note-${subject.replace(/\s/g, '-')}`; 
      
      // The actual CSS class name, with slashes escaped for CSS selector
      // This needs to match exactly what's in globals.css
      const cssClassName = `rdp-day_has-note-${subject.replace(/\s/g, '-').replace(/\//g, '\\/')}`;

      if (!customModifiers[modifierKey]) {
        customModifiers[modifierKey] = [];
      }
      customModifiers[modifierKey].push(date);
      modifierClassNamesMap[modifierKey] = cssClassName;
      datesWithAnyNote.push(date);
    });
  }

  customModifiers.hasNote = datesWithAnyNote;
  modifierClassNamesMap.hasNote = "rdp-day_hasNote";

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 border-2 border-black shadow-custom-black !text-black"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 relative" // Keep relative here
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        day_today: "bg-[#FFDD00] !text-black border-2 border-black shadow-custom-black", // Ensure text is black
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      modifiers={customModifiers}
      modifierClassNames={modifierClassNamesMap}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };