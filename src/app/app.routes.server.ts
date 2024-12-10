import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'analytics/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams:() => {
      return new Promise(resolve => resolve([1,2,3,4,5].map(id => ({ id: id.toString() }))))
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
];
