"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { LearnedEntry, addEntry, updateEntry } from "@/lib/data-store";
import { showSuccess, showError } from "@/utils/toast";

// Define the form schema using Zod
const formSchema = z.object({
  date: z.date({
    required_error: "Veuillez sélectionner une date.",
  }),
  note: z.string().min(10, "La note doit contenir au moins 10 caractères.").max(500, "La note ne peut pas dépasser 500 caractères."),
  link: z.string().url("Le lien doit être une URL valide.").optional().or(z.literal("")),
  subject: z.string().min(1, "Veuillez sélectionner une matière."),
  tags: z.string().optional(),
  chokbarometer: z.number().min(0).max(100),
});

const predefinedSubjects = [
  "Développement Web",
  "Science",
  "Histoire",
  "Art",
  "Sport",
  "Langues",
  "Philosophie",
  "Autre",
];

interface EntryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialEntry?: LearnedEntry; // Optional, for editing
  onSave: () => void; // Callback to refresh entries after save
  defaultDate?: Date; // Optional, for pre-setting date when adding from calendar
}

const EntryFormDialog: React.FC<EntryFormDialogProps> = ({
  open,
  onOpenChange,
  initialEntry,
  onSave,
  defaultDate,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: initialEntry ? new Date(initialEntry.date) : defaultDate || new Date(),
      note: initialEntry?.note || "",
      link: initialEntry?.link || "",
      subject: initialEntry?.subject || "",
      tags: initialEntry?.tags.join(", ") || "",
      chokbarometer: initialEntry?.chokbarometer || 50,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        date: initialEntry ? new Date(initialEntry.date) : defaultDate || new Date(),
        note: initialEntry?.note || "",
        link: initialEntry?.link || "",
        subject: initialEntry?.subject || "",
        tags: initialEntry?.tags.join(", ") || "",
        chokbarometer: initialEntry?.chokbarometer || 50,
      });
    }
  }, [open, initialEntry, defaultDate, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const entryData = {
      date: format(values.date, "yyyy-MM-dd"),
      note: values.note,
      link: values.link || undefined,
      subject: values.subject,
      tags: values.tags ? values.tags.split(",").map((tag) => tag.trim()) : [],
      chokbarometer: values.chokbarometer,
    };

    if (initialEntry) {
      // Update existing entry
      const updated = updateEntry({ ...initialEntry, ...entryData });
      if (updated) {
        showSuccess("Entrée mise à jour avec succès !");
        onSave();
        onOpenChange(false);
      } else {
        showError("Erreur lors de la mise à jour de l'entrée.");
      }
    } else {
      // Add new entry
      addEntry(entryData);
      showSuccess("Nouvelle entrée ajoutée avec succès !");
      onSave();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{initialEntry ? "Modifier l'entrée" : "Nouvelle Entrée"}</DialogTitle>
          <DialogDescription>
            {initialEntry ? "Modifiez les détails de votre entrée." : "Ajoutez ce que vous avez appris aujourd'hui."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Sélectionnez une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note du jour</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Qu'avez-vous appris aujourd'hui ?"
                      className="resize-y min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lien (optionnel)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://exemple.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matière</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une matière" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {predefinedSubjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (séparés par des virgules, ex: "React, Frontend")</FormLabel>
                  <FormControl>
                    <Input placeholder="React, JavaScript, CSS" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chokbarometer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chokbaromètre : {field.value}%</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[field.value]}
                      onValueChange={(val) => field.onChange(val[0])}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="w-full">
                {initialEntry ? "Mettre à jour l'entrée" : "Sauvegarder l'entrée"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EntryFormDialog;