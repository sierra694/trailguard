from __future__ import annotations
import os
from pathlib import Path
import rasterio
import numpy as np
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/trailguard")

def _stats_for_raster(path: Path) -> dict:
    with rasterio.open(path) as src:
        arr = src.read(1).astype("float64")
        nodata = src.nodata
        if nodata is not None:
            arr = np.where(arr == nodata, np.nan, arr)
        return {
            "min": float(np.nanmin(arr)),
            "max": float(np.nanmax(arr)),
            "mean": float(np.nanmean(arr)),
            "std": float(np.nanstd(arr)),
        }, src.width, src.height, src.res[0], src.res[1], nodata

def register_layers(layer_paths: dict[str, Path]) -> None:
    conn = psycopg2.connect(DATABASE_URL)
    try:
        with conn, conn.cursor() as cur:
            for layer_type, path in layer_paths.items():
                stats, width, height, px, py, nodata = _stats_for_raster(path)
                cur.execute(
                    '''
                    INSERT INTO terrain_layers
                      (raster_name, layer_type, srid, path, width, height, pixel_size_x, pixel_size_y, nodata, stats)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s::jsonb)
                    ''',
                    (path.name, layer_type, 4326, str(path), width, height, px, py, nodata, json_dumps(stats))
                )
    finally:
        conn.close()

def json_dumps(obj: dict) -> str:
    import json
    return json.dumps(obj)