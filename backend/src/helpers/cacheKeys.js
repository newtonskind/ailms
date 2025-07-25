// Generate a cache key for the course list, role/group aware
function coursesListKey(user) {
  // e.g., courses:list:learner:Engineering
  return `courses:list:${user.role}:${user.userGroup || 'all'}`;
}

// Generate a cache key for user profile
function userProfileKey(userId) {
  return `user:profile:${userId}`;
}

module.exports = {
  coursesListKey,
  userProfileKey,
}; 