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
import { addEntry } from "@/lib/data-store";
import { showSuccess } from "@/utils/toast";

// Define the form schema using Zod
const formSchema = z.object({
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

const NewEntryPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: "",
      link: "",
      subject: "",
      tags: "",
      chokbarometer: 50,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newEntry = {
      date: format(new Date(), "yyyy-MM-dd"),
      note: values.note,
      link: values.link || undefined,
      subject: values.subject,
      tags: values.tags ? values.tags.split(",").map((tag) => tag.trim()) : [],
      chokbarometer: values.chokbarometer,
    };
    addEntry(newEntry);
    showSuccess("Nouvelle entrée ajoutée avec succès !");
    form.reset(); // Reset the form after submission
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Nouvelle Entrée</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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

          <Button type="submit" className="w-full">
            Sauvegarder l'entrée
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewEntryPage;