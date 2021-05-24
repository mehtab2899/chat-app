const users = [];

// join user to chat
const userJoin = (id, username, room) => {
	const user = { id, username, room };
	users.push(user);
	return user;
};

// user leaves
const userLeaves = (id) => {
	const index = users.findIndex((user) => user.id === id);
	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
};

// get room users
const getRoomUsers = (room) => {
	return users.filter((user) => user.room === room);
};

// get current user
const getCurrentUser = (id) => {
	return users.find((user) => user.id === id);
};

module.exports = {
	userJoin,
	getCurrentUser,
	getRoomUsers,
	userLeaves,
};
