const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const { 
	userJoin, 
	getCurrentUser, 
	userLeave, 
	getRoomUsers,
	roomAdd,
	getRoomStatus,
	updateCode,
	updateCompiler
	 } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static('public'));

// Run when client connects
io.on('connection', socket => {
    // Listen for code Shared
    socket.on('joinRoom', ({ username, room }) => {
    	const user = userJoin(socket.id, username, room);
    	const roomf = roomAdd(room, 'init0', 0);
    	console.log(roomf.cc);
    	socket.join(user.room);
    	socket.emit('message', 'You have joined the room!');
    	if(roomf.cc !== 'init0')
    	{
    		var shared_code = roomf.cc;
    		io.to(user.room).emit('receive', shared_code);
    	}
    	socket.emit('rlang', roomf.comp);
    	socket.broadcast.to(user.room).emit('message', `${user.username} has joined the room!`);
    	io.to(user.room).emit('roomUsers', {
			room: user.room,
			users: getRoomUsers(user.room)
		});
		socket.on('chatMessage', msg => {
			var user = getCurrentUser(socket.id);
			socket.broadcast.to(user.room).emit('chat', {
				username : user.username,
				text : msg
			});
		});
		socket.on('send', (shared_code) => {
			var user = getCurrentUser(socket.id);
			updateCode(user.room, shared_code);
        	socket.broadcast.to(user.room).emit('receive', shared_code);
        	socket.broadcast.to(user.room).emit('message', `${user.username} has shared the code!`);
			socket.emit('message', 'You have shared your code!');
    	});
    	socket.on('lang', (team_id) => {
    		var user = getCurrentUser(socket.id);
    		updateCompiler(user.room, team_id);
    		socket.broadcast.to(user.room).emit('rlang', team_id);
    	});
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

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
