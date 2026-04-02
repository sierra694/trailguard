const { clamp, normalize } = require('../utils/clamp');

/**
 * Første produktive versjon av risiko:
 * - treefall styres av vind + eksponering + metningsproxy
 * - mud styres av drenering + TWI + nedbør
 * - snow/ice styres av freeze-thaw + topografi
 */
function calculateSegmentRisk(input) {
  const windExposure = normalize(input.wind_exposure ?? 0, 100);
  const ridgeExposure = normalize(input.ridge_proxy ?? 0, 100);
  const drainage = normalize(input.drainage_proxy ?? 0, 500);
  const twi = normalize(input.twi ?? 0, 20);
  const slope = normalize(input.slope_deg ?? 0, 45);

  const gust = normalize(input.wind_gust_ms ?? 0, 30);
  const precip24 = normalize(input.precip_24h_mm ?? 0, 60);
  const precip7d = normalize(input.precip_7d_mm ?? 0, 160);
  const freezeThaw = normalize(input.freeze_thaw_cycles ?? 0, 5);
  const snowDepth = normalize(input.snow_depth_cm ?? 0, 120);

  const treefall = clamp(
    0.34 * gust +
    0.20 * windExposure +
    0.16 * ridgeExposure +
    0.14 * drainage +
    0.10 * precip7d +
    0.06 * slope
  );

  const mud = clamp(
    0.28 * precip24 +
    0.22 * precip7d +
    0.22 * drainage +
    0.18 * twi +
    0.10 * slope
  );

  const snowIce = clamp(
    0.30 * freezeThaw +
    0.24 * snowDepth +
    0.18 * slope +
    0.16 * drainage +
    0.12 * twi
  );

  const overall = clamp(0.44 * treefall + 0.34 * mud + 0.22 * snowIce);

  return {
    treefall,
    mud,
    snowIce,
    overall
  };
}

module.exports = { calculateSegmentRisk };