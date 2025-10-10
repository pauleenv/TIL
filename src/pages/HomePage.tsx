"use client";

import React from "react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Calendar } from "@/components/ui/calendar";

const HomePage = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)]">
      <h2 className="text-3xl font-bold mb-6">Votre Calendrier d'Apprentissage</h2>
      <div className="bg-card p-6 rounded-lg shadow-lg">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </div>
      <p className="text-lg text-muted-foreground mt-4">
        Sélectionnez une date pour voir ou ajouter des entrées.
      </p>
    </div>
  );
};

export default HomePage;