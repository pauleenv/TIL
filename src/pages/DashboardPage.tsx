"use client";

import React from "react";

const DashboardPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)]">
      <h2 className="text-3xl font-bold mb-6">Tableau de Bord</h2>
      <p className="text-lg text-muted-foreground">
        Vos statistiques d'apprentissage apparaîtront ici.
      </p>
    </div>
  );
};

export default DashboardPage;