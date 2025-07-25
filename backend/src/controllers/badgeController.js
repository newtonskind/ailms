const Badge = require('../models/Badge');

exports.listBadges = async (req, res) => {
  try {
    const badges = await Badge.find();
    res.json(badges);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}; 