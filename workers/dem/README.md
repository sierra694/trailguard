# TrailGuard DEM Worker

Denne workeren tar en DEM GeoTIFF som input og genererer terrengderiverte rasterlag.

## Input
- GeoTIFF DEM i `data/raw/input_dem.tif`

## Output
- `slope_deg.tif`
- `aspect_deg.tif`
- `hillshade.tif`
- `curvature_proxy.tif`
- `ridge_proxy.tif`
- `flow_accum_proxy.tif`
- `drainage_proxy.tif`
- `twi_proxy.tif`
- `wind_exposure_proxy.tif`

## Kjøring
```bash
python -m trailguard_dem.run_pipeline --dem data/raw/input_dem.tif --out data/processed --register-db
```

## Kommentar
Noen lag er foreløpig proxies og ikke full hydrologisk D8/D∞-implementasjon.
Strukturen er laget slik at du senere kan bytte ut funksjonene med WhiteboxTools/TauDEM uten å endre resten av appen.