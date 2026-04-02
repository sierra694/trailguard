import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';

export default function App() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [terrainLayers, setTerrainLayers] = useState([]);
  const [risk, setRisk] = useState(null);

  useEffect(() => {
    if (mapInstance.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [10.75, 59.91],
      zoom: 10
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    mapInstance.current = map;

    fetch('http://localhost:3000/terrain/latest')
      .then(r => r.json())
      .then(setTerrainLayers)
      .catch(() => setTerrainLayers([]));

    fetch('http://localhost:3000/risk/segment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wind_exposure: 42,
        ridge_proxy: 33,
        drainage_proxy: 120,
        twi: 7.5,
        slope_deg: 12,
        wind_gust_ms: 14,
        precip_24h_mm: 4,
        precip_7d_mm: 16,
        freeze_thaw_cycles: 1,
        snow_depth_cm: 0
      })
    })
      .then(r => r.json())
      .then(setRisk)
      .catch(() => setRisk(null));

    return () => map.remove();
  }, []);

  return (
    <div className="shell">
      <div className="sidebar">
        <div className="card">
          <h2 style={{marginTop: 0}}>TrailGuard DEM</h2>
          <div className="small">Full terrain pipeline scaffold</div>
        </div>

        <div className="card">
          <h3 style={{marginTop: 0}}>Planned overlays</h3>
          <label><input type="checkbox" checked readOnly /> Slope</label>
          <label><input type="checkbox" checked readOnly /> Aspect</label>
          <label><input type="checkbox" checked readOnly /> Hillshade</label>
          <label><input type="checkbox" checked readOnly /> Ridge exposure</label>
          <label><input type="checkbox" checked readOnly /> Wind exposure</label>
          <label><input type="checkbox" checked readOnly /> Drainage proxy</label>
          <label><input type="checkbox" checked readOnly /> TWI proxy</label>
        </div>

        <div className="card">
          <h3 style={{marginTop: 0}}>Terrenglag i DB</h3>
          {terrainLayers.length === 0 ? (
            <div className="small">Ingen lag registrert ennå. Kjør DEM-pipelinen først.</div>
          ) : terrainLayers.map(layer => (
            <div key={layer.id} style={{marginBottom: 10}}>
              <div><strong>{layer.layer_type}</strong></div>
              <div className="mono">{layer.path}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 style={{marginTop: 0}}>Eksempel risk-output</h3>
          {risk ? (
            <>
              <div className="row"><span>Treefall</span><strong>{risk.treefall.toFixed(2)}</strong></div>
              <div className="row"><span>Mud</span><strong>{risk.mud.toFixed(2)}</strong></div>
              <div className="row"><span>Snow/Ice</span><strong>{risk.snowIce.toFixed(2)}</strong></div>
              <div className="row"><span>Overall</span><strong>{risk.overall.toFixed(2)}</strong></div>
            </>
          ) : (
            <div className="small">Kunne ikke hente risk-output.</div>
          )}
        </div>
      </div>
      <div className="map-wrap">
        <div id="map" ref={mapRef} />
      </div>
    </div>
  );
}