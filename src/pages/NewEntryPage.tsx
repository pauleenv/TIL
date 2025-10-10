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
  // we might want to navigate away or handle it.
  // For this page, we want it to always be open, so we'll just manage the state.
  // If the user closes it, they probably want to go back.
  const handleOpenChange = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      navigate("/"); // Navigate to home if the dialog is closed
    }
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