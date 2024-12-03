import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

config()

app.get('/api/loc/autocomplete', async (req, res) => {
  const locAutoCompleteUrl = process.env['LOC_AUTOCOMPLETE_URL']
  const locApiKey = process.env['LOC_API_KEY']
  
  const {q} = req.query as {q: string}

  const fullAutoCompleteUrl = `${locAutoCompleteUrl}?key=${locApiKey}&q=${encodeURIComponent(q)}&limit=5&dedupe=1&`
  // console.log('fullAutoCompleteUrl ', fullAutoCompleteUrl)

  const response = await fetch(fullAutoCompleteUrl);
  const data = await response.json()

  let results = []
  if (data?.[0]?.place_id) {
    // console.log('data ', data)
    results = data.map((place: Record<string, any>) => {
      return { 
        name: place['display_name'],
        latitude: place['lat'],
        longitude: place['lon']
      }
    })
  }
  return res.send(results)
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
