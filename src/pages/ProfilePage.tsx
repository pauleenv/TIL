"use client";

import React, { useEffect } from 'react';
import { useSession } from '@/components/SessionContextProvider';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { showSuccess, showError } from '@/utils/toast';
import { User as UserIcon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const profileFormSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis.").max(50, "Le prénom ne peut pas dépasser 50 caractères.").optional(),
  lastName: z.string().min(1, "Le nom est requis.").max(50, "Le nom ne peut pas dépasser 50 caractères.").optional(),
  avatarUrl: z.string().url("L'URL de l'avatar doit être valide.").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfilePage = () => {
  const { user, loading, session } = useSession();
  const navigate = useNavigate();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      avatarUrl: "",
    },
  });

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
          console.error("Error fetching profile:", error);
          showError("Erreur lors du chargement du profil.");
        } else if (data) {
          form.reset({
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            avatarUrl: data.avatar_url || "",
          });
        }
      };
      fetchProfile();
    }
  }, [user, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) {
      showError("Vous devez être connecté pour mettre à jour votre profil.");
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: values.firstName,
        last_name: values.lastName,
        avatar_url: values.avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      console.error("Error updating profile:", error);
      showError("Erreur lors de la mise à jour du profil.");
    } else {
      showSuccess("Profil mis à jour avec succès !");
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
      showError("Erreur lors de la déconnexion.");
    } else {
      showSuccess("Déconnexion réussie !");
      navigate('/login');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-180px)]">Chargement du profil...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-180px)] text-muted-foreground">Veuillez vous connecter pour voir votre profil.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] p-4">
      <Card className="w-full max-w-md bg-white border-2 border-black drop-shadow-custom-black-lg rounded-[16px]"> {/* Changed to drop-shadow-custom-black-lg */}
        <CardHeader>
          <CardTitle className="text-center">Votre Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center mb-6">
            {form.watch("avatarUrl") ? (
              <img src={form.watch("avatarUrl")} alt="Avatar" className="w-24 h-24 rounded-full object-cover mb-4" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <UserIcon className="h-12 w-12 text-gray-500" />
              </div>
            )}
            <p className="text-lg font-semibold">{user.email}</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avatarUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de l'avatar</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/avatar.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Mettre à jour le profil</Button>
            </form>
          </Form>
          <Button variant="outline" className="w-full mt-4" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Déconnexion
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;