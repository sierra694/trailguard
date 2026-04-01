# TrailGuard Online v4

This version loads trails dynamically from OpenStreetMap / Overpass based on the visible map area.

## Re-deploy your existing app

1. Open your GitHub repository for the app
2. Delete the old `index.html`
3. Upload the new `index.html` from this package
4. Commit the change
5. Vercel will deploy the update automatically

## Notes
- If live trail loading fails, the app falls back to the demo trail set.
- Reports are still stored per browser/device.
