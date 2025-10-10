"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form"; // Import useFieldArray
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar as CalendarIcon, PlusCircle, XCircle, ArrowUp, ArrowDown } from "lucide-react"; // Import ArrowUp and ArrowDown
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { LearnedEntry, addEntry, updateEntry } from "@/lib/data-store";
import { showSuccess, showError } from "@/utils/toast";
import { useSession } from '@/components/SessionContextProvider'; // Import useSession

// Define the form schema using Zod
const formSchema = z.object({
  date: z.date({
    required_error: "Veuillez sélectionner une date.",
  }),
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères.").max(100, "Le titre ne peut pas dépasser 100 caractères."),
  note: z.string().min(10, "La note doit contenir au moins 10 caractères.").max(500, "La note ne peut pas dépasser 500 caractères."),
  link: z.array(z.object({ value: z.string().url("Le lien doit être une URL valide.").optional().or(z.literal("")) })).optional(), // Changed to array of objects with value
  subject: z.string().min(1, "Veuillez sélectionner une matière."),
  chokbarometer: z.enum(["Intéressant", "Surprenant", "Incroyable", "Chokbar"], {
    required_error: "Veuillez sélectionner une intensité pour le chokbaromètre.",
  }),
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

const chokbarometerOptions = ["Intéressant", "Surprenant", "Incroyable", "Chokbar"];

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
  const { user } = useSession(); // Get the current user from session

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: initialEntry ? new Date(initialEntry.date) : defaultDate || new Date(),
      title: initialEntry?.title || "",
      note: initialEntry?.note || "",
      link: initialEntry?.link?.map(l => ({ value: l })) || [{ value: "" }], // Initialize with an empty link field if no initial links
      subject: initialEntry?.subject || "",
      chokbarometer: initialEntry?.chokbarometer || "Intéressant",
    },
  });

  const { fields, append, remove, move } = useFieldArray({ // Added 'move'
    control: form.control,
    name: "link",
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        date: initialEntry ? new Date(initialEntry.date) : defaultDate || new Date(),
        title: initialEntry?.title || "",
        note: initialEntry?.note || "",
        link: initialEntry?.link?.map(l => ({ value: l })) || [{ value: "" }],
        subject: initialEntry?.subject || "",
        chokbarometer: initialEntry?.chokbarometer || "Intéressant",
      });
    }
  }, [open, initialEntry, defaultDate, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      showError("Vous devez être connecté pour sauvegarder une entrée.");
      return;
    }

    // Filter out empty link strings
    const validLinks = values.link
      ?.map(l => l.value)
      .filter((link): link is string => !!link);

    const entryData = {
      user_id: user.id, // Add user_id
      date: format(values.date, "yyyy-MM-dd"),
      title: values.title,
      note: values.note,
      link: validLinks && validLinks.length > 0 ? validLinks : undefined, // Pass array or undefined
      subject: values.subject,
      chokbarometer: values.chokbarometer,
    };

    if (initialEntry) {
      // Update existing entry
      const updated = await updateEntry({ ...initialEntry, ...entryData, id: initialEntry.id, created_at: initialEntry.created_at, updated_at: new Date().toISOString() });
      if (updated) {
        showSuccess("Entrée mise à jour avec succès !");
        onSave();
        onOpenChange(false);
      } else {
        showError("Erreur lors de la mise à jour de l'entrée.");
      }
    } else {
      // Add new entry
      const added = await addEntry(entryData);
      if (added) {
        showSuccess("Nouvelle entrée ajoutée avec succès !");
        onSave();
        onOpenChange(false);
      } else {
        showError("Erreur lors de l'ajout de l'entrée.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[90vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
                            "w-full sm:w-[240px] pl-3 text-left font-normal", // Make it full width on small screens
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Un titre concis pour ce que vous avez appris" {...field} />
                  </FormControl>
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

            {/* Multiple Links Section */}
            <FormItem>
              <FormLabel>Liens (optionnel)</FormLabel>
              <div className="space-y-2">
                {fields.map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => move(index, index - 1)}
                      disabled={index === 0}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <ArrowUp className="h-5 w-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => move(index, index + 1)}
                      disabled={index === fields.length - 1}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <ArrowDown className="h-5 w-5" />
                    </Button>
                    <FormField
                      control={form.control}
                      name={`link.${index}.value`}
                      render={({ field }) => (
                        <FormControl>
                          <Input placeholder="https://exemple.com" {...field} />
                        </FormControl>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <XCircle className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ value: "" })}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un lien
                </Button>
              </div>
              <FormMessage>{form.formState.errors.link?.message}</FormMessage>
            </FormItem>

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
              name="chokbarometer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chokbaromètre</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez l'intensité de la surprise" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {chokbarometerOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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