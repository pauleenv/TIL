"use client";

import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client"; // Import Supabase client

export interface LearnedEntry {
  id: string;
  user_id: string; // Add user_id to link entries to users
  date: string; // YYYY-MM-DD
  title: string;
  note: string;
  link?: string;
  subject: string;
  chokbarometer: "Intéressant" | "Surprenant" | "Incroyable" | "Chokbar";
  created_at: string; // ISO string
  updated_at: string; // ISO string
}

// Removed STORAGE_KEY as we are no longer using localStorage

export const getEntries = async (userId: string): Promise<LearnedEntry[]> => {
  const { data, error } = await supabase
    .from('learned_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error("Error fetching entries:", error);
    return [];
  }
  return data as LearnedEntry[];
};

export const addEntry = async (newEntry: Omit<LearnedEntry, "id" | "created_at" | "updated_at">): Promise<LearnedEntry | null> => {
  const { data, error } = await supabase
    .from('learned_entries')
    .insert(newEntry)
    .select()
    .single();

  if (error) {
    console.error("Error adding entry:", error);
    return null;
  }
  return data as LearnedEntry;
};

export const updateEntry = async (updatedEntry: LearnedEntry): Promise<LearnedEntry | null> => {
  const { data, error } = await supabase
    .from('learned_entries')
    .update({
      date: updatedEntry.date,
      title: updatedEntry.title,
      note: updatedEntry.note,
      link: updatedEntry.link,
      subject: updatedEntry.subject,
      chokbarometer: updatedEntry.chokbarometer,
      updated_at: new Date().toISOString(),
    })
    .eq('id', updatedEntry.id)
    .eq('user_id', updatedEntry.user_id) // Ensure user can only update their own entry
    .select()
    .single();

  if (error) {
    console.error("Error updating entry:", error);
    return null;
  }
  return data as LearnedEntry;
};

export const deleteEntry = async (id: string, userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('learned_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', userId); // Ensure user can only delete their own entry

  if (error) {
    console.error("Error deleting entry:", error);
    return false;
  }
  return true;
};

export const getEntriesByDate = async (date: Date, userId: string): Promise<LearnedEntry[]> => {
  const formattedDate = format(date, "yyyy-MM-dd");
  const { data, error } = await supabase
    .from('learned_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('date', formattedDate)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching entries by date:", error);
    return [];
  }
  return data as LearnedEntry[];
};

export const getAllSubjects = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('learned_entries')
    .select('subject')
    .eq('user_id', userId);

  if (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
  const subjects = new Set<string>();
  data.forEach(entry => subjects.add(entry.subject));
  return Array.from(subjects).sort();
};

export const getEntriesBySubject = async (subject: string, userId: string): Promise<LearnedEntry[]> => {
  const { data, error } = await supabase
    .from('learned_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('subject', subject)
    .order('date', { ascending: false });

  if (error) {
    console.error("Error fetching entries by subject:", error);
    return [];
  }
  return data as LearnedEntry[];
};