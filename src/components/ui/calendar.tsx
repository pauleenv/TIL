"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { subjectColors } from "@/lib/subject-colors"; // Import subjectColors

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

  // Les modificateurs et leurs classes associées sont supprimés car le point est rendu directement dans DayContent
  // const modifiers = {
  //   hasNote: (day: Date) => {
  //     if (!day || !(day instanceof Date)) return false;
  //     const dateString = day.toISOString().split('T')[0];
  //     return datesWithNotes.has(dateString);
  //   },
  // };

  // const modifiersClassNames = {
  //   hasNote: "rdp-day_hasNote",
  // };

  const customDayContent = (day: Date | undefined) => {
    // Vérification pour s'assurer que 'day' est un objet Date valide
    if (!day || !(day instanceof Date)) {
      return null; // Retourne null pour laisser DayPicker gérer l'affichage par défaut ou ne rien afficher
    }

    const dateString = day.toISOString().split('T')[0];
    const subject = datesWithNotes.get(dateString);

    const dotStyle: React.CSSProperties = {};
    if (subject) {
      const colors = subjectColors[subject];
      if (colors) {
        dotStyle.backgroundColor = colors.background;
      }
    }

    return (
      <div className="relative flex items-center justify-center h-full w-full">
        {/* Affiche le numéro du jour */}
        <span>{day.getDate()}</span>
        {/* Affiche le point si une note existe pour ce jour */}
        {subject && (
          <span
            className="absolute bottom-1 right-1 w-2 h-2 rounded-full border-2 border-black shadow-[3px_2px_0px_rgb(0,0,0)] z-10"
            style={dotStyle}
          />
        )}
      </div>
    );
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
        day_today: "bg-[var(--current-day-bg)] text-black", // Maintient la couleur de fond et le texte noir
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
      // Les props modifiers et modifiersClassNames sont supprimées car le point est rendu directement
      // modifiers={modifiers}
      // modifiersClassNames={modifiersClassNames}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };