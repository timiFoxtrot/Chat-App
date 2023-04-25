const users: { id: string; username: string; room: string }[] = [];

export const addUser = ({
  id,
  username,
  room,
}: {
  id: string;
  username: string;
  room: string;
}) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return {
      error: "Username and room required!",
    };
  }

  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  if (existingUser) {
    return {
      error: "Username is in use!",
    };
  }

  const user = { id, username, room };
  users.push(user);

  return { user };
};

export const removeUser = (id: string) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

export const getUser = (id: string) => {
  const user = users.find((user) => user.id === id);

  return user;
};

export const getUsersInRoom = (room: string) => {
  const roomUsers = users.filter((user) => user.room === room.toLowerCase());

  return roomUsers;
};
