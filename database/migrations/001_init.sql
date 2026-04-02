CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS terrain_layers (
  id BIGSERIAL PRIMARY KEY,
  raster_name TEXT NOT NULL,
  layer_type TEXT NOT NULL,
  srid INTEGER NOT NULL DEFAULT 4326,
  path TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  pixel_size_x DOUBLE PRECISION,
  pixel_size_y DOUBLE PRECISION,
  nodata DOUBLE PRECISION,
  stats JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trail_segments (
  id BIGSERIAL PRIMARY KEY,
  external_id TEXT,
  source TEXT NOT NULL DEFAULT 'osm',
  name TEXT,
  geom GEOMETRY(LineString, 4326) NOT NULL,
  length_m DOUBLE PRECISION,
  slope_mean DOUBLE PRECISION,
  aspect_mean DOUBLE PRECISION,
  twi_mean DOUBLE PRECISION,
  drainage_proxy_mean DOUBLE PRECISION,
  ridge_proxy_mean DOUBLE PRECISION,
  wind_exposure_mean DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS trail_segments_geom_idx
  ON trail_segments
  USING GIST (geom);

CREATE TABLE IF NOT EXISTS hazard_reports (
  id BIGSERIAL PRIMARY KEY,
  trail_segment_id BIGINT REFERENCES trail_segments(id) ON DELETE SET NULL,
  report_type TEXT NOT NULL,
  note TEXT,
  geom GEOMETRY(Point, 4326),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);