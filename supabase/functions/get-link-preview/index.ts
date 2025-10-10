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
    console.log('Edge Function: Received URL for preview:', url); // Log the received URL

    if (!url) {
      console.error('Edge Function: URL is required but not provided.');
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(url);
    console.log(`Edge Function: Fetch response status for ${url}: ${response.status} ${response.statusText}`); // Log fetch status

    if (!response.ok) {
      console.error(`Edge Function: Failed to fetch URL ${url}: ${response.statusText}`);
      return new Response(JSON.stringify({ error: `Failed to fetch URL: ${response.statusText}` }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const html = await response.text();
    // console.log('Edge Function: Fetched HTML (first 500 chars):', html.substring(0, 500)); // Log a snippet of HTML

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

    console.log('Edge Function: Generated preview object:', preview); // Log the final preview object

    return new Response(JSON.stringify(preview), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Edge Function: Error fetching link preview:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});