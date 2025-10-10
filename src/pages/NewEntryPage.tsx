"use client";

import React from "react";

const NewEntryPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)]">
      <h2 className="text-3xl font-bold mb-6">Nouvelle Entrée</h2>
      <p className="text-lg text-muted-foreground">
        Ici, vous pourrez ajouter ce que vous avez appris aujourd'hui.
      </p>
    </div>
  );
};

export default NewEntryPage;