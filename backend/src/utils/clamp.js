function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function normalize(value, maxValue) {
  if (value == null || !Number.isFinite(value)) return 0;
  if (!maxValue || maxValue <= 0) return 0;
  return clamp(value / maxValue);
}

module.exports = { clamp, normalize };