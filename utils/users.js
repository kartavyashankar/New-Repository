const users = [];

module.exports.joinUser = (id, username, room) => {
  // Join user to chat
  const user = { id, username, room };
  users.push(user);

  return user;
};

module.exports.getCurrentUser = (id) => {
  // Get current user
  return users.find((user) => user.id === id);
};

// User leaves chat
module.exports.userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
};

// Get room users
module.exports.getRoomUsers = (room) =>
  users.filter((user) => user.room === room);
