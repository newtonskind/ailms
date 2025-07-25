const UserGroup = require('../models/UserGroup');
const { invalidateUserGroupsCache } = require('./courseController');
const { getUserGroups } = require('./courseController');

exports.createUserGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const group = new UserGroup({ name, description });
    await group.save();
    await invalidateUserGroupsCache();
    res.status(201).json(group);
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ error: 'Group name must be unique' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

exports.listUserGroups = getUserGroups;

exports.updateUserGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const group = await UserGroup.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );
    if (!group) return res.status(404).json({ error: 'Group not found' });
    await invalidateUserGroupsCache();
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteUserGroup = async (req, res) => {
  try {
    const group = await UserGroup.findByIdAndDelete(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });
    await invalidateUserGroupsCache();
    res.json({ message: 'Group deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}; 