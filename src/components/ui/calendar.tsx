"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { getSubjectTagClasses } from "@/lib/subject-colors";
import { format, isValid } from "date-fns"; // Import isValid

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  datesWithNotes?: Map<string, string>; // Add prop for dates with notes
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  datesWithNotes, // Destructure the new prop
  ...props
}: CalendarProps) {
  const CustomDay = (dayProps: any) => {
    const day = dayProps.day;
    
    // Add a check here to ensure 'day' is a valid Date object
    if (!isValid(day)) {
      // If the day is invalid, render the default DayPicker.Day without custom logic
      return <DayPicker.Day {...dayProps} />;
    }

    const formattedDay = format(day, "yyyy-MM-dd");
    const subject = datesWithNotes?.get(formattedDay);
    const { style: dotStyle } = subject ? getSubjectTagClasses(subject) : { style: {} };

    return (
      <div className="relative">
        <DayPicker.Day {...dayProps} />
        {subject && (
          <div
            className="absolute bottom-1 right-1 w-2 h-2 rounded-full"
            style={{ backgroundColor: dotStyle.backgroundColor }}
            title={`Note sur: ${subject}`}
          />
        )}
      </div>
    );
  };

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
        Day: CustomDay, // Use the custom Day component
      }}
      locale={fr}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };