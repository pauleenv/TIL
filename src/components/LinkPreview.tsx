"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface LinkPreviewProps {
  url: string;
}

interface LinkMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
}

const fetchLinkPreview = async (linkUrl: string): Promise<LinkMetadata | null> => {
  if (!linkUrl) return null;

  // Replace with your actual Supabase Project ID and Edge Function name
  const SUPABASE_PROJECT_ID = 'hpjtfckzrdvyizwbkbqc'; 
  const EDGE_FUNCTION_NAME = 'get-link-preview';
  const EDGE_FUNCTION_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/${EDGE_FUNCTION_NAME}`;

  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.auth.session()?.access_token || ''}`, // Include auth token if needed by your function
      },
      body: JSON.stringify({ url: linkUrl }),
    });

    if (!response.ok) {
      console.error(`Error fetching link preview: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch link preview:", error);
    return null;
  }
};

const LinkPreview: React.FC<LinkPreviewProps> = ({ url }) => {
  const { data: preview, isLoading, isError } = useQuery<LinkMetadata | null, Error>(
    ['linkPreview', url],
    () => fetchLinkPreview(url),
    {
      enabled: !!url, // Only run query if URL is provided
      staleTime: 1000 * 60 * 60, // Cache for 1 hour
      cacheTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
    }
  );

  if (!url) return null;

  if (isLoading) {
    return (
      <Card className="mt-2">
        <CardContent className="p-3 flex items-center space-x-3">
          <Skeleton className="h-12 w-12 rounded-md" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !preview || !preview.title) {
    return (
      <p className="text-xs text-muted-foreground mt-2">
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          Lien source
        </a> (Impossible de charger la prévisualisation)
      </p>
    );
  }

  return (
    <Card className="mt-2 hover:shadow-md transition-shadow">
      <a href={preview.url || url} target="_blank" rel="noopener noreferrer" className="flex items-center p-3">
        {preview.image && (
          <img src={preview.image} alt={preview.title || "Link preview"} className="w-16 h-16 object-cover rounded-md mr-3 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{preview.title}</p>
          {preview.description && <p className="text-xs text-muted-foreground line-clamp-2">{preview.description}</p>}
          <p className="text-xs text-blue-600 truncate">{preview.url || url}</p>
        </div>
      </a>
    </Card>
  );
};

export default LinkPreview;