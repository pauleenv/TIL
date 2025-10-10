"use client";

import React from "react";
import EntryFormDialog from "@/components/EntryFormDialog";
import { useNavigate } from "react-router-dom";

const NewEntryPage = () => {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = React.useState(true); // Always open for this page

  const handleSave = () => {
    // After saving, we can close the form and navigate to home or just keep it open
    // For now, let's just close it and let the user decide.
    // If we want to navigate to home, we can do: navigate("/");
  };

  // If the dialog is closed (e.g., by pressing escape or clicking outside),
  // we no longer force navigation to home. The user can choose to stay or navigate manually.
  const handleOpenChange = (open: boolean) => {
    setIsFormOpen(open);
    // Removed navigate("/") here. The user can now close the dialog and stay on this page.
    // If they want to go back, they can use the browser's back button or the app's navigation.
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)]">
      <EntryFormDialog
        open={isFormOpen}
        onOpenChange={handleOpenChange}
        onSave={handleSave}
        defaultDate={new Date()} // Default to today's date for new entries
      />
    </div>
  );
};

export default NewEntryPage;