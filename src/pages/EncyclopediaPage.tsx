"use client";

import React from "react";
import { LearnedEntry, getEntries, getAllSubjects, getEntriesBySubject } from "@/lib/data-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Tag, ChevronDown, ChevronUp } from "lucide-react"; // Import ChevronDown and ChevronUp
import { useSession } from '@/components/SessionContextProvider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"; // Import Collapsible components
import { Button } from "@/components/ui/button";
import LinkPreview from "@/components/LinkPreview"; // Will be created next

const EncyclopediaPage = () => {
  const { user, loading } = useSession();
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
    if (!loading && user) {
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
              <Collapsible> {/* Wrap card content in Collapsible */}
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{entry.title}</CardTitle>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronDown className="h-4 w-4 collapsible-icon data-[state=open]:rotate-180 transition-transform" />
                        <span className="sr-only">Toggle details</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(entry.date), "PPP", { locale: fr })}
                    </span>
                    <span
                      className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                    >
                      <Tag className="h-3 w-3 mr-1" /> {entry.subject}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Chokbaromètre: {entry.chokbarometer}
                    </span>
                  </div>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{entry.note}</p>
                    {entry.link && <LinkPreview url={entry.link} />} {/* Link preview will go here */}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EncyclopediaPage;