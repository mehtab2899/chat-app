const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const socket = io();

// get user and room from url
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

// join chat room
socket.emit("joinRoom", { username, room });

// get room and user info
socket.on("roomUsers", ({ room, users }) => {
	outputRoomName(room);
	outputUsers(users);
});

// message from server
socket.on("message", (message) => {
	outputMessage(message);

	// scroll to chat messages
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
	e.preventDefault();

	// get message text
	const msg = e.target.elements.msg.value;

	// emit message to server
	socket.emit("chatMessage", msg);

	e.target.elements.msg.value = "";
	e.target.elements.msg.value.focus();
});

// output message to client
const outputMessage = (message) => {
	const div = document.createElement("div");
	div.classList.add("message");
	div.innerHTML = `
    <p class="meta">${message.user} <span>${message.time}</span></p>
    <p class="text">
    ${message.text}
    </p>
    `;
	document.querySelector(".chat-messages").appendChild(div);
};

// add room name to DOM
const outputRoomName = (room) => {
	roomName.innerText = room;
};

// add user name to DOM
const outputUsers = (users) => {
	userList.innerHTML = `
	${users.map((user) => `<li>${user.username}</li>`).join("")}`;
};
