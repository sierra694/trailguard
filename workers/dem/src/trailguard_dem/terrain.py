from __future__ import annotations

from pathlib import Path
import numpy as np
import rasterio
from scipy.ndimage import gaussian_gradient_magnitude, gaussian_laplace
from .io import write_like


def _safe_gradient(arr: np.ndarray, res_y: float, res_x: float):
    filled = np.where(np.isfinite(arr), arr, np.nanmean(arr))
    gy, gx = np.gradient(filled, res_y, res_x)
    return gy, gx


def compute_terrain_layers(dem_path: Path, out_dir: Path) -> dict[str, Path]:
    outputs: dict[str, Path] = {}

    with rasterio.open(dem_path) as src:
        dem = src.read(1).astype("float64")
        if src.nodata is not None:
            dem = np.where(dem == src.nodata, np.nan, dem)

        res_x, res_y = src.res[0], src.res[1]
        gy, gx = _safe_gradient(dem, res_y, res_x)

        slope_rad = np.arctan(np.sqrt(gx**2 + gy**2))
        slope_deg = np.degrees(slope_rad)

        aspect = np.degrees(np.arctan2(-gx, gy))
        aspect = np.where(aspect < 0, 360 + aspect, aspect)

        azimuth = 315.0
        altitude = 45.0
        az_rad = np.radians(azimuth)
        alt_rad = np.radians(altitude)
        hillshade = 255.0 * (
            np.cos(alt_rad) * np.cos(slope_rad) +
            np.sin(alt_rad) * np.sin(slope_rad) * np.cos(az_rad - np.radians(aspect))
        )
        hillshade = np.clip(hillshade, 0, 255)

        curvature_proxy = -gaussian_laplace(np.where(np.isfinite(dem), dem, np.nanmean(dem)), sigma=2)

        grad_mag = gaussian_gradient_magnitude(np.where(np.isfinite(dem), dem, np.nanmean(dem)), sigma=2)
        ridge_proxy = np.clip(grad_mag, 0, np.nanpercentile(grad_mag, 99))

        rel_relief = np.nanmax(dem) - dem
        flow_accum_proxy = np.maximum(rel_relief, 0)

        drainage_proxy = (1.0 / np.maximum(slope_deg, 0.5)) * 8.0 + np.log1p(flow_accum_proxy)
        twi_proxy = np.log1p(np.maximum(flow_accum_proxy, 0)) - np.log(np.tan(np.maximum(slope_rad, 1e-4)))

        # Enkel vindeksponering:
        # høy rygg + sørvest/vest-eksponerte flater får høyere proxy.
        dominant_wind_dir = 240.0
        directional_factor = 0.5 + 0.5 * np.cos(np.radians(aspect - dominant_wind_dir))
        wind_exposure_proxy = ridge_proxy * directional_factor

        layers = {
            "slope_deg": slope_deg,
            "aspect_deg": aspect,
            "hillshade": hillshade,
            "curvature_proxy": curvature_proxy,
            "ridge_proxy": ridge_proxy,
            "flow_accum_proxy": flow_accum_proxy,
            "drainage_proxy": drainage_proxy,
            "twi_proxy": twi_proxy,
            "wind_exposure_proxy": wind_exposure_proxy,
        }

        for name, arr in layers.items():
            path = out_dir / f"{name}.tif"
            write_like(src, path, arr)
            outputs[name] = path

    return outputs