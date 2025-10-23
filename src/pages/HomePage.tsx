"use client";

import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { LearnedEntry, getEntriesByDate, deleteEntry } from "@/lib/data-store";
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

const HomePage = () => {
  const { user, loading } = useSession();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [entriesForSelectedDate, setEntriesForSelectedDate] = React.useState<LearnedEntry[]>([]);
  const [isFormDialogOpen, setIsFormDialogOpen] = React.useState(false);
  const [editingEntry, setEditingEntry] = React.useState<LearnedEntry | undefined>(undefined);

  const fetchEntries = React.useCallback(async () => {
    if (selectedDate && user) {
      const entries = await getEntriesByDate(selectedDate, user.id);
      setEntriesForSelectedDate(entries);
    } else {
      setEntriesForSelectedDate([]);
    }
  }, [selectedDate, user]);

  React.useEffect(() => {
    if (!loading && user) {
      fetchEntries();
    }
  }, [selectedDate, user, loading, fetchEntries]);

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
    } else {
      showError("Erreur lors de la suppression de l'entrée.");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-180px)]">Chargement des données...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-180px)] text-muted-foreground">Veuillez vous connecter pour voir vos entrées.</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center min-h-[calc(100vh-180px)]">
      <div className="flex flex-col items-center lg:w-1/2">
        <h2 className="text-3xl font-bold mb-6 text-center">Votre Calendrier d'Apprentissage</h2>
        <div className="bg-card p-6 rounded-lg shadow-lg">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
            locale={fr}
          />
        </div>
        <p className="text-lg text-muted-foreground mt-4 text-center">
          Sélectionnez une date pour voir ou ajouter des entrées.
        </p>
        {selectedDate && (
          <Button onClick={handleAddEntryClick} className="mt-4 w-full lg:w-auto">
            Ajouter une entrée pour le {format(selectedDate, "PPP", { locale: fr })}
          </Button>
        )}
      </div>

      <div className="lg:w-1/2 w-full">
        <h3 className="text-2xl font-bold mb-4 text-center lg:text-left">
          Entrées pour le {selectedDate ? format(selectedDate, "PPP", { locale: fr }) : "aucune date sélectionnée"}
        </h3>
        {entriesForSelectedDate.length === 0 ? (
          <p className="text-muted-foreground text-center lg:text-left">
            Aucune entrée pour cette date.
          </p>
        ) : (
          <div className="space-y-4">
            {entriesForSelectedDate.map((entry) => (
              <Card key={entry.id} className="relative">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{entry.title}</span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditEntryClick(entry)}>
                        Modifier
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">Supprimer</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous absolument sûr(e) ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action ne peut pas être annulée. Cela supprimera définitivement votre entrée.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteEntry(entry.id)}>Supprimer</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2 whitespace-pre-wrap">{entry.note}</p>
                  {entry.link && entry.link.map((linkItem, index) => (
                    <LinkPreview key={index} url={linkItem} />
                  ))}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        getSubjectTagClasses(entry.subject) // Use the utility function here
                      )}
                    >
                      {entry.subject}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Chokbaromètre: {entry.chokbarometer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <EntryFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        initialEntry={editingEntry}
        onSave={fetchEntries}
        defaultDate={selectedDate}
      />
    </div>
  );
};

export default HomePage;