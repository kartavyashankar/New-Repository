const users = [];
const rooms = [];

// Join user to chat
function userJoin(id, username, room) {
	const user = { id, username, room };

	users.push(user);

	return user;
}

function roomAdd(roomName, cc, comp) {
	const index = rooms.findIndex(roomf => roomf.roomName === roomName);
	if(index === -1) {
		const roomf = { roomName, cc, comp };
		rooms.push(roomf);
		return roomf;
	}
	return rooms[index];
}

function getRoomStatus(roomName) {
	return rooms.find(roomf => roomf.roomName === roomName);
}

// Get current user
function getCurrentUser(id) {
	return users.find(user => user.id === id);
}

// User leaves chat
function  userLeave(id) {
	const index = users.findIndex(user => user.id === id);
	if(index !== -1) {
		return users.splice(index, 1)[0];
	}
}

function updateCode(roomName, cc) {
	const index = rooms.findIndex(roomf => roomf.roomName === roomName);
	if(index !== -1) {
		rooms[index].cc = cc;
	}
}

function updateCompiler(roomName, team_id) {
	const index = rooms.findIndex(roomf => roomf.roomName === roomName);
	if(index !== -1) {
		rooms[index].comp = team_id;
	}
}

// Get room users
function getRoomUsers(room) {
	return users.filter(user => user.room === room);
}

module.exports = {
	userJoin,
	getCurrentUser,
	userLeave,
	getRoomUsers,
	roomAdd,
	getRoomStatus,
	updateCode,
	updateCompiler
};