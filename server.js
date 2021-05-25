const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const formatMessage = require("./utils/message");
const {
	userJoin,
	getCurrentUser,
	userLeaves,
	getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = "ChatCord Bot";

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// run when client connects
io.on("connection", (socket) => {
	socket.on("joinRoom", ({ username, room }) => {
		const user = userJoin(socket.id, username, room);
		socket.join(user.room);

		// welcome current user
		socket.emit("message", formatMessage(botName, "Welcome to Chat App"));

		// Broadcast when a user connects
		socket.broadcast
			.to(user.room)
			.emit(
				"message",
				formatMessage(botName, `${user.username} has joined the chat`)
			);

		// send users and room info
		io.to(user.room).emit("roomUsers", {
			room: user.room,
			users: getRoomUsers(user.room),
		});
	});

	// listen  for chat message
	socket.on("chatMessage", (msg) => {
		const user = getCurrentUser(socket.id);
		io.to(user.room).emit("message", formatMessage(`${user.username}`, msg));
	});

	// when user disconnect
	socket.on("disconnect", () => {
		const user = userLeaves(socket.id);
		if (user) {
			io.to(user.room).emit(
				"message",
				formatMessage(botName, `${user.username} has left the chat`)
			);

			// send users and room info
			io.to(user.room).emit("roomUsers", {
				room: user.room,
				users: getRoomUsers(user.room),
			});
		}
	});
});

server.listen(3000 || process.env.PORT, () => {
	console.log(`server is running on port 3000`);
});
