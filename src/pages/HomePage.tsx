"use client";

import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { LearnedEntry, getEntriesByDate, deleteEntry, getDatesWithFirstEntrySubject } from "@/lib/data-store";
import EntryFormDialog from "@/components/EntryFormDialog";
import { showSuccess, showError } from "@/utils/toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSession } from '@/components/SessionContextProvider';
import LinkPreview from "@/components/LinkPreview";
import { getSubjectTagClasses } from "@/lib/subject-colors"; // Import the utility
import { cn } from "@/lib/utils"; // Import the cn utility

const HomePage = () => {
  const { user, loading } = useSession();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [entriesForSelectedDate, setEntriesForSelectedDate] = React.useState<LearnedEntry[]>([]);
  const [isFormDialogOpen, setIsFormDialogOpen] = React.useState(false);
  const [editingEntry, setEditingEntry] = React.useState<LearnedEntry | undefined>(undefined);
  const [datesWithNotes, setDatesWithNotes] = React.useState<Map<string, string>>(new Map());

  const fetchEntries = React.useCallback(async () => {
    if (selectedDate && user) {
      const entries = await getEntriesByDate(selectedDate, user.id);
      setEntriesForSelectedDate(entries);
    } else {
      setEntriesForSelectedDate([]);
    }
  }, [selectedDate, user]);

  const fetchDatesWithNotes = React.useCallback(async () => {
    if (user) {
      const datesMap = await getDatesWithFirstEntrySubject(user.id);
      setDatesWithNotes(datesMap);
    } else {
      setDatesWithNotes(new Map());
    }
  }, [user]);

  React.useEffect(() => {
    if (!loading && user) {
      fetchEntries();
      fetchDatesWithNotes();
    }
  }, [selectedDate, user, loading, fetchEntries, fetchDatesWithNotes]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleAddEntryClick = () => {
    setEditingEntry(undefined);
    setIsFormDialogOpen(true);
  };

  const handleEditEntryClick = (entry: LearnedEntry) => {
    setEditingEntry(entry);
    setIsFormDialogOpen(true);
  };

  const handleDeleteEntry = async (id: string) => {
    if (!user) {
      showError("Vous devez être connecté pour supprimer une entrée.");
      return;
    }
    const success = await deleteEntry(id, user.id);
    if (success) {
      showSuccess("Entrée supprimée avec succès !");
      fetchEntries();
      fetchDatesWithNotes(); // Refresh dates with notes after deletion
    } else {
      showError("Erreur lors de la suppression de l'entrée.");
    }
  };

  const handleEntrySave = () => {
    fetchEntries();
    fetchDatesWithNotes(); // Refresh dates with notes after save
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-180px)]">Chargement des données...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-180px)] text-muted-foreground">Veuillez vous connecter pour voir vos entrées.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-180px)] pt-8">
      <h2 className="text-black text-3xl font-bold mb-6 text-center">Mon calendrier des découvertes</h2>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        locale={fr}
        datesWithNotes={datesWithNotes} // Pass the datesWithNotes map
      />
      <p className="text-black text-lg mt-4 text-center">
        {selectedDate ? `Aucune entrée pour le ${format(selectedDate, "PPP", { locale: fr })}` : "Sélectionnez une date pour voir ou ajouter des entrées."}
      </p>

      <div className="w-full max-w-lg mt-8">
        {entriesForSelectedDate.length > 0 && (
          <div className="space-y-4">
            {entriesForSelectedDate.map((entry, index) => {
              const { className: tagClassName, style: tagStyle } = getSubjectTagClasses(entry.subject);
              return (
                <Card 
                  key={entry.id} 
                  className={cn(
                    "relative bg-white border-2 border-black rounded-[16px]",
                    index === 0 ? "shadow-super-bold" : "shadow-custom-black-lg" // Appliquer l'ombre super-bold à la première carte
                  )}
                >
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center text-black">
                      <span>{entry.title}</span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditEntryClick(entry)} className="border-2 border-black shadow-custom-black text-black bg-white hover:bg-gray-100">
                          Modifier
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="border-2 border-black shadow-custom-black text-white bg-destructive hover:bg-destructive/90">Supprimer</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="border-2 border-black shadow-custom-black">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-black">Êtes-vous absolument sûr(e) ?</AlertDialogTitle>
                              <AlertDialogDescription className="text-black">
                                Cette action ne peut pas être annulée. Cela supprimera définitivement votre entrée.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-2 border-black shadow-custom-black text-black bg-white hover:bg-gray-100">Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteEntry(entry.id)} className="border-2 border-black shadow-custom-black text-white bg-destructive hover:bg-destructive/90">Supprimer</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-black mb-2 whitespace-pre-wrap">{entry.note}</p>
                    {entry.link && entry.link.map((linkItem, index) => (
                      <LinkPreview key={index} url={linkItem} />
                    ))}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span
                        className={tagClassName}
                        style={tagStyle}
                      >
                        {entry.subject}
                      </span>
                    </div>
                    <p className="text-black mt-2">
                      Chokbaromètre: {entry.chokbarometer}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <EntryFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        initialEntry={editingEntry}
        onSave={handleEntrySave}
        defaultDate={selectedDate}
      />
    </div>
  );
};

export default HomePage;