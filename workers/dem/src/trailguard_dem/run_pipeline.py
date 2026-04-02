from __future__ import annotations

from pathlib import Path
import click
from .utils import ensure_dir
from .terrain import compute_terrain_layers
from .db import register_layers

@click.command()
@click.option("--dem", "dem_path", required=True, type=click.Path(exists=True, path_type=Path))
@click.option("--out", "out_dir", required=True, type=click.Path(path_type=Path))
@click.option("--register-db/--no-register-db", default=True)
def main(dem_path: Path, out_dir: Path, register_db: bool):
    out_dir = ensure_dir(out_dir)
    print(f"Processing DEM: {dem_path}")
    outputs = compute_terrain_layers(dem_path, out_dir)

    for name, path in outputs.items():
        print(f"Created {name}: {path}")

    if register_db:
        register_layers(outputs)
        print("Registered layers in PostGIS")

    print("Done.")

if __name__ == "__main__":
    main()