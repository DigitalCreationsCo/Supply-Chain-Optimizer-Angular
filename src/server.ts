import { AngularAppEngine, createRequestHandler } from '@angular/ssr'
import { config } from 'dotenv';
import { getContext } from '@netlify/angular-runtime/context'

config()

const angularAppEngine = new AngularAppEngine()

export async function netlifyAppEngineHandler(request: any): Promise<Response> {
  const context = getContext()

  const url = new URL(request.url)
  if (url.pathname === '/api/loc/autocomplete') {
    try {
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
  }

  const result = await angularAppEngine.handle(request, context)
  return result || new Response('Not found', { status: 404 })
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createRequestHandler(netlifyAppEngineHandler as unknown as any)