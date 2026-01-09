"use client";

import React from "react";
import { LearnedEntry, getEntries, getAllSubjects, getEntriesBySubject } from "@/lib/data-store";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronDown } from "lucide-react";
import { useSession } from '@/components/SessionContextProvider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import LinkPreview from "@/components/LinkPreview";
import { getSubjectTagClasses, getSubjectDropdownItemClasses } from "@/lib/subject-colors";
import { cn } from "@/lib/utils";
import EntryCardWrapper from "@/components/EntryCardWrapper";
import Chokbarometer from "@/components/Chokbarometer";

const predefinedSubjects = [
  "Tech",
  "Histoire",
  "Sports",
  "Nature/Géographie",
  "Langues",
  "Arts/Pop Culture",
  "Sciences",
];

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
    
    // Filter subjects to only include the predefined ones, or "Autre" if an entry has a subject not in the predefined list
    const allUniqueSubjects = await getAllSubjects(user.id);
    const filteredUniqueSubjects = allUniqueSubjects.filter(subject => predefinedSubjects.includes(subject));
    setSubjects(filteredUniqueSubjects);
    
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
            {predefinedSubjects.map((subject) => {
              const { style: dropdownItemStyle } = getSubjectDropdownItemClasses(subject);
              return (
                <SelectItem key={subject} value={subject} style={dropdownItemStyle}>
                  {subject}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      {filteredEntries.length === 0 ? (
        <p className="text-muted-foreground text-center">
          Aucune entrée trouvée pour cette matière.
        </p>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => {
            const { className: tagClassName, style: tagStyle } = getSubjectTagClasses(entry.subject);
            return (
              <EntryCardWrapper key={entry.id}>
                <Collapsible>
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
                      <span className={tagClassName} style={tagStyle}>
                        {entry.subject}
                      </span>
                      <div className="flex items-center">
                        <Chokbarometer level={entry.chokbarometer} size="sm" />
                      </div>
                    </div>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2 whitespace-pre-wrap">{entry.note}</p>
                      {entry.link && entry.link.map((linkItem, index) => (
                        <LinkPreview key={index} url={linkItem} />
                      ))}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </EntryCardWrapper>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EncyclopediaPage;