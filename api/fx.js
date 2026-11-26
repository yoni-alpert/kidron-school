// Live USD→ILS rate for showing dollar amounts on the English pages.
// GET /api/fx -> {"ilsPerUsd":2.95,"date":"..."}  (cached 12h at Vercel's edge)
export default async function handler(req, res) {
  try {
    const r = await fetch('https://open.er-api.com/v6/latest/USD');
    const j = await r.json();
    const ils = j && j.rates && Number(j.rates.ILS);
    if (!ils || ils < 1 || ils > 10) throw new Error('bad rate');
    res.setHeader('Cache-Control', 'public, s-maxage=43200, stale-while-revalidate=86400');
    return res.status(200).json({ ilsPerUsd: ils, date: j.time_last_update_utc || null });
  } catch (e) {
    res.setHeader('Cache-Control', 'public, s-maxage=600');
    return res.status(502).json({ error: 'fx unavailable' });
  }
}
