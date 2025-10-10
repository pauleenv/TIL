"use client";

import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Home, PlusCircle, Book, BarChart3 } from "lucide-react";
import { MadeWithDyad } from "./made-with-dyad";

const Layout = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Determine the active tab based on the current path
  const getActiveTab = () => {
    if (currentPath === "/") return "home";
    if (currentPath === "/new-entry") return "new-entry";
    if (currentPath === "/encyclopedia") return "encyclopedia";
    if (currentPath === "/dashboard") return "dashboard";
    return "home"; // Default to home
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Today I Learned</h1>
      </header>
      <div className="flex-grow container mx-auto p-4">
        <Tabs value={getActiveTab()} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="home" asChild>
              <Link to="/">
                <Home className="h-4 w-4 mr-2" /> Accueil
              </Link>
            </TabsTrigger>
            <TabsTrigger value="new-entry" asChild>
              <Link to="/new-entry">
                <PlusCircle className="h-4 w-4 mr-2" /> Nouvelle Entrée
              </Link>
            </TabsTrigger>
            <TabsTrigger value="encyclopedia" asChild>
              <Link to="/encyclopedia">
                <Book className="h-4 w-4 mr-2" /> Encyclopédie
              </Link>
            </TabsTrigger>
            <TabsTrigger value="dashboard" asChild>
              <Link to="/dashboard">
                <BarChart3 className="h-4 w-4 mr-2" /> Tableau de bord
              </Link>
            </TabsTrigger>
          </TabsList>
          <div className="py-4">
            <Outlet /> {/* This is where the routed components will render */}
          </div>
        </Tabs>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Layout;