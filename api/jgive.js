// Returns the live total raised on a JGive donation page.
// GET /api/jgive?id=132999  ->  {"id":"132999","raised":3530,"donations":12,"goal":5000}
// Cached at Vercel's edge for 5 minutes so JGive is called at most ~12 times an hour.
export default async function handler(req, res) {
  const id = String((req.query && req.query.id) || '');
  if (!/^\d{1,9}$/.test(id)) return res.status(400).json({ error: 'bad id' });
  try {
    const r = await fetch('https://www.jgive.com/graphql', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'user-agent': 'kidronschool.org.il progress meter' },
      body: JSON.stringify({
        query: 'query($id:ID!){donationTarget(id:$id){id donationTargetSummary{totalAmount donationsPlusAdditionalDonationsCount} goalProperty{amount}}}',
        variables: { id }
      })
    });
    const j = await r.json();
    const d = j && j.data && j.data.donationTarget;
    if (!d) throw new Error('not found');
    const s = d.donationTargetSummary || {};
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    return res.status(200).json({
      id: d.id,
      raised: Math.round(Number(s.totalAmount) || 0),
      donations: s.donationsPlusAdditionalDonationsCount || 0,
      goal: (d.goalProperty && d.goalProperty.amount) || null
    });
  } catch (e) {
    res.setHeader('Cache-Control', 'public, s-maxage=60');
    return res.status(502).json({ error: 'jgive unavailable' });
  }
}
