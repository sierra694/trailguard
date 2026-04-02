# TrailGuard v3 – Full DEM + Terrain Pipeline

Dette repoet er en produksjonsrettet startpakke for TrailGuard med:
- **frontend/** React + Vite + MapLibre
- **backend/** Node.js + Express API
- **workers/dem/** Python DEM-pipeline for terrengderiverte rasterlag
- **database/** PostGIS schema/migreringer
- **docker-compose.yml** for lokal PostGIS

## Funksjoner i denne pakken
- DEM-avledning av:
  - slope (grader)
  - aspect (grader)
  - hillshade
  - curvature proxy
  - ridge exposure proxy
  - wind exposure proxy
  - flow accumulation proxy
  - drainage proxy
  - TWI proxy
- Registrering av genererte rasterlag i PostGIS metadata-tabell
- Backend-API for helse, terrenglag og segment-risiko
- Frontend med kart og overlay-panel
- Klart for videre utvidelse med:
  - raster sampling langs trail-segmenter
  - vektortiles / rastertiles
  - mer avansert hydrologi (WhiteboxTools/TauDEM)
  - ingest av OSM trails til PostGIS

## Hurtigstart

### 1. Start PostGIS
```bash
docker compose up -d
```

### 2. Kjør backend
```bash
cd backend
cp .env.example .env
npm install
npm run migrate
npm run dev
```

### 3. Kjør frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Kjør DEM-pipeline
Legg en GeoTIFF DEM i:
`workers/dem/data/raw/input_dem.tif`

Så:
```bash
cd workers/dem
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python -m trailguard_dem.run_pipeline --dem data/raw/input_dem.tif --out data/processed --register-db
```

## Neste anbefalte steg
1. OSM trail import til PostGIS
2. Raster sampling mot trail-segmenter
3. Tile-server for terrenglag og risikolag
4. Historisk vær + segmentbasert risk scoring