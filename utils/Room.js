module.exports = class Room {
  constructor(name, users) {
    this.name = name;
    this.users = users;
  }

  addUser(username, socket, callback) {
    if (!this.users.includes(username)) {
      // Join to socket.io room
      socket.join(this.name, (err) => {
        if (err) return Error("Failed to add user to room!");

        // Joined user to socket.io room, update local `users` state
        this.users.push(username);
        if (callback) callback();
      });
    } else return Error("User already exists!");
  }

  removeUser(username, callback) {
    if (this.users.includes(username)) {
      // Remove user from `room`;
      this.users.splice(this.users.indexOf(username), 1);
      if (callback) callback();
    } else {
      if (callback) callback(Error("User doesn't exist!"));
    }
  }

  emitAll(socket, event, value) {
    socket.emit(event, value);
    socket.to(this.name).emit(event, value);
  }
};
