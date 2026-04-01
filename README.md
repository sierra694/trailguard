# TrailGuard Online v7

This update fixes the risk model so treefall does not show 90–100% everywhere.

## What changed
- Treefall risk is now event-driven instead of being inflated by general winter weather
- Strong weight is given to:
  - wind gusts >= 17 m/s
  - storm days >= 20 m/s
  - severe storm days >= 24 m/s
  - wet snow days near freezing
- Mud risk now depends mainly on the last 7 days of rain
- Snow risk now depends mainly on the last 14 days of snowfall and freeze/thaw conditions
- User reports now affect only the relevant hazard category more strongly

## Update your existing Vercel deployment
1. Open your GitHub repo
2. Replace:
   - `index.html`
   - `README.md`
3. Keep the existing:
   - `vercel.json`
   - `netlify.toml`
   - `api/trails.js`
4. Commit the changes
5. Wait for Vercel to redeploy
6. Refresh the site
