const User = require('../models/User');
const cache = require('../cache/cacheHelpers');
const { userProfileKey } = require('../helpers/cacheKeys');

exports.getProfile = async (req, res) => {
  try {
    const key = userProfileKey(req.user.userId);
    const cached = await cache.get(key);
    if (cached) return res.json(cached);
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    await cache.set(key, user, 600); // cache for 10 min
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}; 