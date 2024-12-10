import type { Config, Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  try {
    const url = new URL(request.url)

    const locApiKey = process.env['LOC_API_KEY']
    const locAutoCompleteUrl = process.env['LOC_AUTOCOMPLETE_URL']

    const query = url.searchParams.get("q")!

    const fullAutoCompleteUrl = `${locAutoCompleteUrl}?key=${locApiKey}&q=${encodeURIComponent(query)}&limit=5&dedupe=1&`

    const response = await fetch(fullAutoCompleteUrl);
    const data = await response.json()

    let results = []

    if (data?.[0]?.place_id) {
      results = data.map((place: Record<string, any>) => {
        return { 
          name: place['display_name'],
          latitude: place['lat'],
          longitude: place['lon']
        }
      })
    }

    return Response.json(results);
  } catch (error) {
    console.error('API Error:', error);
    return new Response('Server Error', { status: 500 });
  }
};

export const config: Config = {
  path: "/api/loc/autocomplete",
};
