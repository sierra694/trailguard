# TrailGuard Online v6

This version fixes live trail loading by moving the Overpass request into a Vercel serverless function and caching results.

## What changed
- Browser no longer calls public Overpass endpoints directly
- Browser now calls `/api/trails`
- Vercel server function fetches Overpass server-side
- Responses are cached on the server and in the browser
- Demo trails are only used if server-side fetch also fails

## Update your existing Vercel deployment

1. Open your GitHub repo for the app
2. Delete the old files:
   - `index.html`
   - `README.md`
   - `vercel.json`
   - `netlify.toml`
3. Upload the new files from this package:
   - `index.html`
   - `README.md`
   - `vercel.json`
   - `netlify.toml`
4. Also upload the new folder:
   - `api/trails.js`
5. Commit the changes
6. Wait for Vercel to redeploy automatically
7. Refresh your site

## Expected behavior
- Zoomed out: "Zoom in to load trails"
- Zoomed in: trail requests go to `/api/trails`
- If live load succeeds once, the area is cached and reloads faster
- If Overpass is temporarily unavailable, cached trails are used when possible
