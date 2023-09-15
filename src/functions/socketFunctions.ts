interface OnlineUser {
  user: string;
  socket: any; 
  date: number;
}
const global: { onlineUsers: OnlineUser[] } = { onlineUsers: [] };

const addUser = async (user: string, socket: any) => {
  const index = global.onlineUsers.findIndex((user2: OnlineUser) => {
    return user2.user === user;
  });
  if (index === -1) {
    global.onlineUsers.push({ user, socket, date: Date.now() });
  } else {
    global.onlineUsers[index].socket = socket;
  }
};

const removeUser = async (socket: any) => {
  const removedUser = global.onlineUsers.find((user: OnlineUser) => {
    return user.socket === socket;
  });
  global.onlineUsers = global.onlineUsers.filter((user: OnlineUser) => {
    return user.socket !== socket;
  });
  console.log("removed user", removedUser);
};

export { addUser, removeUser };
