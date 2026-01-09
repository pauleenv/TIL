"use client";

import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Book, BarChart3, UserCircle, PlusCircle } from "lucide-react"; // Import PlusCircle for the floating button
import { MadeWithDyad } from "./made-with-dyad";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Import cn for conditional classNames

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const currentPath = location.pathname;

  // Determine the active tab based on the current path
  const getActiveTab = () => {
    if (currentPath === "/") return "home";
    if (currentPath === "/encyclopedia") return "encyclopedia";
    if (currentPath === "/dashboard") return "dashboard";
    return "home"; // Default to home
  };

  const handleProfileClick = () => {
    if (currentPath === "/profile") {
      navigate(-1); // Go back to the previous page
    } else {
      navigate("/profile"); // Go to the profile page
    }
  };

  const handleAddEntryClick = () => {
    navigate("/new-entry");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-transparent p-4 flex justify-between items-center"> {/* Removed bg-primary, text-primary-foreground */}
        <img src="/Logo-1.svg" alt="AJA Logo" className="w-[120px] h-auto" /> {/* Resized logo to 120px width */}
        <Button variant="ghost" size="icon" className="bg-white border-2 border-black drop-shadow-custom-black rounded-full w-10 h-10 flex items-center justify-center text-black hover:bg-gray-100" onClick={handleProfileClick}> {/* Styled profile button, changed to drop-shadow-custom-black */}
          <UserCircle className="h-6 w-6" />
        </Button>
      </header>

      <div className="flex-grow container mx-auto p-4 pb-[80px]">
        <Outlet />
      </div>

      <MadeWithDyad />

      {/* Floating Add Entry Button */}
      {currentPath === "/" && ( // Only show on home page
        <Button
          className="fixed bottom-24 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white border-2 border-black drop-shadow-custom-black-lg flex items-center justify-center text-black z-50 hover:bg-gray-100" // Changed to drop-shadow-custom-black-lg
          onClick={handleAddEntryClick}
          aria-label="Ajouter une nouvelle entrée"
        >
          <PlusCircle className="h-8 w-8" />
        </Button>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-5 left-4 right-3 bg-white border-2 border-black drop-shadow-custom-black-lg rounded-[16px] z-50"> {/* Added border-2 border-black, changed to drop-shadow-custom-black-lg */}
        <Tabs value={getActiveTab()} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-16 bg-transparent"> {/* Changed to 3 columns, removed bg-primary */}
            <TabsTrigger value="home" asChild>
              <Link to="/" className={cn(
                "flex flex-col items-center justify-center text-xs sm:text-sm text-black", // Text color black
                currentPath === "/" && "bg-white drop-shadow-custom-black rounded-[16px] mx-2 my-1.5" // Active tab style: removed border-2 border-black, changed to drop-shadow-custom-black
              )}>
                <Home className="h-5 w-5 mb-1" /> Accueil
              </Link>
            </TabsTrigger>
            {/* Removed New Entry tab */}
            <TabsTrigger value="encyclopedia" asChild>
              <Link to="/encyclopedia" className={cn(
                "flex flex-col items-center justify-center text-xs sm:text-sm text-black", // Text color black
                currentPath === "/encyclopedia" && "bg-white drop-shadow-custom-black rounded-[16px] mx-2 my-1.5" // Active tab style: removed border-2 border-black, changed to drop-shadow-custom-black
              )}>
                <Book className="h-5 w-5 mb-1" /> Encyclopédie
              </Link>
            </TabsTrigger>
            <TabsTrigger value="dashboard" asChild>
              <Link to="/dashboard" className={cn(
                "flex flex-col items-center justify-center text-xs sm:text-sm text-black", // Text color black
                currentPath === "/dashboard" && "bg-white drop-shadow-custom-black rounded-[16px] mx-2 my-1.5" // Active tab style: removed border-2 border-black, changed to drop-shadow-custom-black
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