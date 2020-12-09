class Rooms {
  constructor() {
    if (Rooms.instance == null) {
      this.rooms = [];
      Rooms.instance = this;
    }
    return Rooms.instance;
  }

  /***
   * Creates new room
   * @param room Room object
   * @param callback callback function (optional)
   */
  add(room, callback) {
    this.rooms.push(room);
    if (callback) callback();
  }

  /***
   * Removes existing room
   * @param name name of room to remove
   * @param callback callback function (optional)
   * @returns Error if room doesn't exist, else nothing;
   */
  remove(name, callback) {
    let removed = false;
    this.rooms.forEach((room, i) => {
      if (room.name === name) {
        // Room found, remove
        this.rooms.splice(i, 1);
        removed = true;
        if (callback) callback();
      }
    });
    if (!removed) {
      if (callback) callback(Error("No such room exists!"));
    }
  }

  /*** Removes any empty room */
  removeEmpty() {
    this.rooms.forEach((room, i) => {
      if (room.users.length === 0) {
        this.rooms.splice(i, 1);
      }
    });
  }

  /*** Gets you room object by name
   * @param name room name
   */
  get(name) {
    return this.rooms.find((room) => room.name === name);
  }
}

const rooms = new Rooms();
Object.freeze(rooms);
module.exports = rooms;
