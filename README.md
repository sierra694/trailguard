# TrailGuard Online

This is a deployable static version of the TrailGuard prototype.

## What it does
- Renders the trail map in the browser
- Fetches live weather from Open-Meteo when available
- Falls back to built-in demo weather if the API is slow or unavailable
- Stores hazard reports in the browser's local storage
- Includes a toggleable snow overlay
- Marks Strava activity signals as demo/mock

## Deploy options

### Vercel
1. Create a new GitHub repository and upload the files in this folder
2. Import the repo into Vercel
3. Framework preset: **Other**
4. Build command: leave empty
5. Output directory: leave empty
6. Deploy

### Netlify
1. Create a new GitHub repository and upload the files in this folder
2. Import the repo into Netlify
3. Build command: leave empty
4. Publish directory: `.`
5. Deploy

### GitHub Pages
1. Create a GitHub repo and upload these files
2. Go to **Settings → Pages**
3. Choose **Deploy from a branch**
4. Select the main branch and root folder
5. Save

## Local preview
You should still run it through a local server instead of opening the file directly:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Notes
- This is still a prototype. Reports are stored per browser/device.
- Live weather is real. Strava signals are demo only.
- Trail data is hardcoded in the current prototype.
