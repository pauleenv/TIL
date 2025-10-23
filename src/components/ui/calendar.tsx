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
  const modifierClassNamesMap: Record<string, string> = {}; // To store the mapping from modifier name to CSS class name

  if (datesWithNotes) {
    datesWithNotes.forEach((subject, dateString) => {
      const date = new Date(dateString);
      
      // Sanitize the subject name to create a valid CSS class name, escaping slashes
      const sanitizedSubjectForCss = subject.replace(/\s/g, '-').replace(/\//g, '\\/');
      
      // The modifier name used internally by react-day-picker (no escaped slashes)
      const modifierName = `has-note-${subject.replace(/\s/g, '-')}`; 
      
      // The actual CSS class name, which includes the escaped slash
      const cssClassName = `rdp-day_has-note-${sanitizedSubjectForCss}`;

      if (!customModifiers[modifierName]) {
        customModifiers[modifierName] = [];
      }
      customModifiers[modifierName].push(date);
      datesWithAnyNote.push(date);
      modifierClassNamesMap[modifierName] = cssClassName; // Store the mapping
    });
  }

  // Add the generic 'hasNote' modifier for all days with notes
  customModifiers.hasNote = datesWithAnyNote;
  modifierClassNamesMap.hasNote = "rdp-day_hasNote"; // Map generic modifier to its class

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
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
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
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      modifiers={customModifiers} // Pass custom modifiers
      modifierClassNames={modifierClassNamesMap} // Use the generated map for class names
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };