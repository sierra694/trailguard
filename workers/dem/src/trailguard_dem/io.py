from __future__ import annotations
from pathlib import Path
import numpy as np
import rasterio

def write_like(src, out_path: Path, array: np.ndarray, dtype="float32", nodata=-9999.0):
    profile = src.profile.copy()
    profile.update(dtype=dtype, count=1, compress="deflate", nodata=nodata)
    with rasterio.open(out_path, "w", **profile) as dst:
        out = array.astype(dtype)
        out = np.where(np.isfinite(out), out, nodata)
        dst.write(out, 1)