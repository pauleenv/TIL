"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DayModifiers } from "react-day-picker";
import { fr } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { subjectColors } from "@/lib/subject-colors"; // Import subjectColors to get dot colors

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  datesWithNotes?: Map<string, string>; // Map<dateString, subject>
};

function Calendar({
  className,
  classNames,
  showHead = true,
  datesWithNotes = new Map(),
  ...props
}: CalendarProps) {
  const modifiers = {
    hasNote: (day: Date) => {
      if (!day || !(day instanceof Date)) return false;
      const dateString = day.toISOString().split('T')[0];
      return datesWithNotes.has(dateString);
    },
  };

  const modifiersClassNames = {
    hasNote: "rdp-day_hasNote",
  };

  // Prepare dynamic styles for the dots
  const dayStyles: DayModifiers = {};
  Array.from(datesWithNotes.entries()).forEach(([dateString, subject]) => {
    const day = new Date(dateString);
    // Ensure the date object is valid before adding to styles
    if (day instanceof Date && !isNaN(day.getTime())) {
      dayStyles[day] = { '--dot-background-color': subjectColors[subject]?.background || '#000000' };
    }
  });

  // DayContent should just render the day number
  const customDayContent = ({ date }: { date: Date | undefined }) => {
    if (!date || !(date instanceof Date)) {
      return null; // Let DayPicker render default if not a valid date
    }
    return <span>{date.getDate()}</span>;
  };

  return (
    <DayPicker
      showHead={showHead}
      locale={fr}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 text-black"
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
          "rounded-md bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "text-black", // La couleur de fond est gérée par globals.css
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4 text-black" strokeWidth={3} />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4 text-black" strokeWidth={3} />,
        DayContent: customDayContent,
      }}
      modifiers={modifiers}
      modifiersClassNames={modifiersClassNames}
      styles={dayStyles} // Applique les styles dynamiques ici
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };