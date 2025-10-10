"use client";

import React from "react";

const EncyclopediaPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)]">
      <h2 className="text-3xl font-bold mb-6">Votre Encyclopédie</h2>
      <p className="text-lg text-muted-foreground">
        Toutes vos connaissances seront listées ici.
      </p>
    </div>
  );
};

export default EncyclopediaPage;