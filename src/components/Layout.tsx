"use client";

import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, BarChart3, UserCircle, PlusCircle } from "lucide-react";
import { MadeWithDyad } from "./made-with-dyad";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import HomeActive from "@/assets/icons/HomeActive"; // Importation de l'icône d'accueil active
import HomeInactive from "@/assets/icons/HomeInactive"; // Importation de l'icône d'accueil inactive

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const getActiveTab = () => {
    if (currentPath === "/") return "home";
    if (currentPath === "/encyclopedia") return "encyclopedia";
    if (currentPath === "/dashboard") return "dashboard";
    return "home";
  };

  const handleProfileClick = () => {
    if (currentPath === "/profile") {
      navigate(-1);
    } else {
      navigate("/profile");
    }
  };

  const handleAddEntryClick = () => {
    navigate("/new-entry");
  };

  const isActive = (path: string) => currentPath === path;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-transparent p-4 flex justify-between items-center">
        <h1 className="text-black text-4xl font-bold text-center flex-grow">AJA</h1>
        <Button variant="ghost" size="icon" className="bg-white border-2 border-black shadow-custom-black rounded-full w-10 h-10 flex items-center justify-center text-black hover:bg-gray-100" onClick={handleProfileClick}>
          <UserCircle className="h-6 w-6" />
        </Button>
      </header>

      <div className="flex-grow container mx-auto p-4 pb-[80px]">
        <Outlet />
      </div>

      <MadeWithDyad />

      {/* Floating Add Entry Button */}
      {currentPath === "/" && (
        <Button
          className="fixed bottom-24 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white border-2 border-black shadow-custom-black-lg flex items-center justify-center text-black z-50 hover:bg-gray-100"
          onClick={handleAddEntryClick}
          aria-label="Ajouter une nouvelle entrée"
        >
          <PlusCircle className="h-8 w-8" />
        </Button>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-5 left-4 right-3 bg-white border-2 border-black shadow-custom-black-lg rounded-[16px] z-50">
        <Tabs value={getActiveTab()} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-16 bg-transparent">
            <TabsTrigger value="home" asChild>
              <Link to="/" className={cn(
                "flex flex-col items-center justify-center text-xs sm:text-sm text-black",
                isActive("/") && "bg-white shadow-custom-black rounded-[16px] mx-2 my-1.5"
              )}>
                {isActive("/") ? <HomeActive className="h-5 w-5 mb-1" /> : <HomeInactive className="h-5 w-5 mb-1" />} Accueil
              </Link>
            </TabsTrigger>
            <TabsTrigger value="encyclopedia" asChild>
              <Link to="/encyclopedia" className={cn(
                "flex flex-col items-center justify-center text-xs sm:text-sm text-black",
                isActive("/encyclopedia") && "bg-white shadow-custom-black rounded-[16px] mx-2 my-1.5"
              )}>
                <Book className="h-5 w-5 mb-1" /> Encyclopédie
              </Link>
            </TabsTrigger>
            <TabsTrigger value="dashboard" asChild>
              <Link to="/dashboard" className={cn(
                "flex flex-col items-center justify-center text-xs sm:text-sm text-black",
                isActive("/dashboard") && "bg-white shadow-custom-black rounded-[16px] mx-2 my-1.5"
              )}>
                <BarChart3 className="h-5 w-5 mb-1" /> Tableau de bord
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </nav>
    </div>
  );
};

export default Layout;