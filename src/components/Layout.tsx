"use client";

import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, PlusCircle, Book, BarChart3, UserCircle } from "lucide-react";
import { MadeWithDyad } from "./made-with-dyad";
import { Button } from "@/components/ui/button";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const currentPath = location.pathname;

  // Determine the active tab based on the current path
  const getActiveTab = () => {
    if (currentPath === "/") return "home";
    if (currentPath === "/new-entry") return "new-entry";
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

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-primary-foreground p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold text-center flex-grow">Today I Learned</h1>
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10" onClick={handleProfileClick}> {/* Use Button with onClick */}
          <UserCircle className="h-6 w-6" />
        </Button>
      </header>

      <div className="flex-grow container mx-auto p-4 pb-[80px]">
        <Outlet />
      </div>

      <MadeWithDyad />

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground shadow-lg z-50">
        <Tabs value={getActiveTab()} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-16">
            <TabsTrigger value="home" asChild>
              <Link to="/" className="flex flex-col items-center justify-center text-xs sm:text-sm">
                <Home className="h-5 w-5 mb-1" /> Accueil
              </Link>
            </TabsTrigger>
            <TabsTrigger value="new-entry" asChild>
              <Link to="/new-entry" className="flex flex-col items-center justify-center text-xs sm:text-sm">
                <PlusCircle className="h-5 w-5 mb-1" /> Nouvelle Entrée
              </Link>
            </TabsTrigger>
            <TabsTrigger value="encyclopedia" asChild>
              <Link to="/encyclopedia" className="flex flex-col items-center justify-center text-xs sm:text-sm">
                <Book className="h-5 w-5 mb-1" /> Encyclopédie
              </Link>
            </TabsTrigger>
            <TabsTrigger value="dashboard" asChild>
              <Link to="/dashboard" className="flex flex-col items-center justify-center text-xs sm:text-sm">
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