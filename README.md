# TrailGuard Online v5

This update fixes live trail loading by:
- sending Overpass requests in the correct `application/x-www-form-urlencoded` format
- trying multiple public Overpass instances
- requiring zoom level 11+ before querying to avoid oversized requests
- falling back to demo trails only if all live endpoints fail

## Update an existing Vercel deployment
1. Open your GitHub repo
2. Delete the old `index.html`
3. Upload the new `index.html` from this package
4. Also replace `README.md`, `vercel.json`, and `netlify.toml`
5. Commit the changes
6. Wait for Vercel to redeploy automatically
7. Refresh your site

## What to expect
- At low zoom: "Zoom in to load trails"
- At normal trail zoom: live OSM trails should load for the visible area
- If all public endpoints fail temporarily: demo trails appear instead
