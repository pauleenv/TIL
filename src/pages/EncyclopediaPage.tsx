"use client";

import React from "react";
import { LearnedEntry, getEntries, getAllSubjects, getEntriesBySubject } from "@/lib/data-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Tag } from "lucide-react";
import { useSession } from '@/components/SessionContextProvider'; // Import useSession

const EncyclopediaPage = () => {
  const { user, loading } = useSession(); // Get the current user from session
  const [allEntries, setAllEntries] = React.useState<LearnedEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = React.useState<LearnedEntry[]>([]);
  const [selectedSubject, setSelectedSubject] = React.useState<string>("all");
  const [subjects, setSubjects] = React.useState<string[]>([]);

  const fetchEntries = React.useCallback(async () => {
    if (!user) {
      setAllEntries([]);
      setSubjects([]);
      setFilteredEntries([]);
      return;
    }

    const entries = await getEntries(user.id);
    setAllEntries(entries);
    const allUniqueSubjects = await getAllSubjects(user.id);
    setSubjects(allUniqueSubjects);

    if (selectedSubject === "all") {
      setFilteredEntries(entries);
    } else {
      const subjectEntries = await getEntriesBySubject(selectedSubject, user.id);
      setFilteredEntries(subjectEntries);
    }
  }, [selectedSubject, user]);

  React.useEffect(() => {
    if (!loading && user) { // Fetch entries only when user is loaded
      fetchEntries();
    }
  }, [fetchEntries, loading, user]);

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-180px)]">Chargement des données...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-180px)] text-muted-foreground">Veuillez vous connecter pour voir votre encyclopédie.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Votre Encyclopédie Personnelle</h2>

      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-lg text-muted-foreground">
          Explorez toutes vos connaissances apprises.
        </p>
        <Select onValueChange={handleSubjectChange} value={selectedSubject}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par matière" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les matières</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredEntries.length === 0 ? (
        <p className="text-muted-foreground text-center">
          Aucune entrée trouvée pour cette matière.
        </p>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{entry.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(entry.date), "PPP", { locale: fr })}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{entry.note}</p>
                {entry.link && (
                  <p className="text-xs text-blue-600 hover:underline mb-2">
                    <a href={entry.link} target="_blank" rel="noopener noreferrer">
                      Lien source
                    </a>
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span
                    className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                  >
                    <Tag className="h-3 w-3 mr-1" /> {entry.subject}
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
  );
};

export default EncyclopediaPage;