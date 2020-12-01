// const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const { 
	userJoin, 
	getCurrentUser, 
	userLeave, 
	getRoomUsers
	 } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static('static'));

// Run when a client connects
io.on('connection', socket => {
	// console.log("New WS Connection...");
	socket.on('joinRoom', ({ username, room }) => {
		const user = userJoin(socket.id, username, room);
		socket.join(user.room);
		socket.emit('message', 'You have joined the room!');
		socket.broadcast.to(user.room).emit('message', `${user.username} has joined the room!`);
		io.to(user.room).emit('roomUsers', {
			room: user.room,
			users: getRoomUsers(user.room)
		});
	})

	socket.on('code', (msg) => {
		const user = getCurrentUser(socket.id);
		socket.broadcast.to(user.room).emit('receive', msg);
		socket.broadcast.to(user.room).emit('message', `${user.username} has shared the code!`);
		socket.emit('message', 'You have shared your code!');
	});

	socket.on('disconnect', () => {
		const user = userLeave(socket.id);
		if(user) {
			socket.broadcast.to(user.room).emit('message', `${user.username} has left the room!`);
			socket.emit('message', 'You are offline! Please reload the page...');
			io.to(user.room).emit('roomUsers', {
				room : user.room,
				users: getRoomUsers(user.room)
			});
		}
	});
});


const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
