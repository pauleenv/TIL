"use client";

import { format } from "date-fns";

export interface LearnedEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string; // Nouveau champ pour le titre
  note: string;
  link?: string;
  subject: string;
  chokbarometer: "Intéressant" | "Surprenant" | "Incroyable"; // Nouvelles options
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

const STORAGE_KEY = "today-i-learned-entries";

export const getEntries = (): LearnedEntry[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveEntries = (entries: LearnedEntry[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

export const addEntry = (newEntry: Omit<LearnedEntry, "id" | "createdAt" | "updatedAt">): LearnedEntry => {
  const entries = getEntries();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const entryWithMetadata: LearnedEntry = {
    ...newEntry,
    id,
    createdAt: now,
    updatedAt: now,
  };
  entries.push(entryWithMetadata);
  saveEntries(entries);
  return entryWithMetadata;
};

export const updateEntry = (updatedEntry: LearnedEntry): LearnedEntry | null => {
  const entries = getEntries();
  const index = entries.findIndex((entry) => entry.id === updatedEntry.id);
  if (index > -1) {
    entries[index] = { ...updatedEntry, updatedAt: new Date().toISOString() };
    saveEntries(entries);
    return entries[index];
  }
  return null;
};

export const deleteEntry = (id: string): boolean => {
  const entries = getEntries();
  const initialLength = entries.length;
  const filteredEntries = entries.filter((entry) => entry.id !== id);
  saveEntries(filteredEntries);
  return filteredEntries.length < initialLength;
};

export const getEntriesByDate = (date: Date): LearnedEntry[] => {
  const formattedDate = format(date, "yyyy-MM-dd");
  const entries = getEntries();
  return entries.filter(entry => entry.date === formattedDate);
};

export const getAllSubjects = (): string[] => {
  const entries = getEntries();
  const subjects = new Set<string>();
  entries.forEach(entry => subjects.add(entry.subject));
  return Array.from(subjects).sort();
};

export const getEntriesBySubject = (subject: string): LearnedEntry[] => {
  const entries = getEntries();
  return entries.filter(entry => entry.subject === subject);
};