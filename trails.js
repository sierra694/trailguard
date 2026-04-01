export default async function handler(req, res) {
  const { south, west, north, east } = req.query || {};
  const vals = [south, west, north, east].map(Number);
  if (vals.some(v => Number.isNaN(v))) {
    return res.status(400).json({ error: 'Missing or invalid bbox params' });
  }

  const [s, w, n, e] = vals;
  if (!(s < n && w < e)) {
    return res.status(400).json({ error: 'Invalid bbox ordering' });
  }

  // Reject oversized areas to reduce Overpass failures.
  const latSpan = Math.abs(n - s);
  const lonSpan = Math.abs(e - w);
  if (latSpan > 0.25 || lonSpan > 0.4) {
    return res.status(400).json({ error: 'Viewport too large. Zoom in further.' });
  }

  const query = `
[out:json][timeout:20];
(
  way["highway"="path"]["bicycle"!~"no"](${s},${w},${n},${e});
  way["highway"="track"]["bicycle"!~"no"](${s},${w},${n},${e});
  way["mtb:scale"](${s},${w},${n},${e});
);
out geom;
`;

  const endpoints = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.private.coffee/api/interpreter'
  ];

  const fetchOne = async (endpoint) => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 9000);
    try {
      const body = new URLSearchParams({ data: query }).toString();
      const r = await fetch(endpoint, {
        method: 'POST',
        body,
        headers: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'user-agent': 'TrailGuard/1.0 trail loader'
        },
        signal: ctrl.signal,
      });
      if (!r.ok) throw new Error(`${new URL(endpoint).host} ${r.status}`);
      return await r.json();
    } finally {
      clearTimeout(t);
    }
  };

  const errors = [];
  for (const endpoint of endpoints) {
    try {
      const data = await fetchOne(endpoint);
      res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400');
      return res.status(200).json(data);
    } catch (err) {
      errors.push(err?.message || String(err));
    }
  }

  return res.status(502).json({ error: errors.join(' | ') });
}