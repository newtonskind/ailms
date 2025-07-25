const cache = require('../cache/cacheHelpers');
const Recommendation = require('../models/Recommendation');

function recommendationsKey(userId) {
  return `recommendations:${userId}`;
}

exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.params.userId;
    const key = recommendationsKey(userId);
    const cached = await cache.get(key);
    if (cached) return res.json(cached);
    // For now, fetch from DB (AI logic can be added later)
    const rec = await Recommendation.findOne({ userId });
    if (!rec) return res.status(404).json({ error: 'No recommendations found' });
    await cache.set(key, rec, 600); // cache for 10 min
    res.json(rec);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}; 