import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(url);
    const html = await response.text();

    const getMetaContent = (htmlString: string, property: string) => {
      const regex = new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i');
      const match = htmlString.match(regex);
      return match ? match[1] : null;
    };

    const getTitle = (htmlString: string) => {
      const regex = /<title[^>]*>([^<]*)<\/title>/i;
      const match = htmlString.match(regex);
      return match ? match[1] : null;
    };

    const getDescription = (htmlString: string) => {
      // Correction: suppression de la virgule après la regex
      const regex = /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i;
      const match = htmlString.match(regex);
      return match ? match[1] : null;
    };

    const preview = {
      title: getMetaContent(html, 'og:title') || getTitle(html),
      description: getMetaContent(html, 'og:description') || getDescription(html),
      image: getMetaContent(html, 'og:image'),
      url: getMetaContent(html, 'og:url') || url,
    };

    return new Response(JSON.stringify(preview), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching link preview:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});