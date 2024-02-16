import { io } from "socket.io-client";

let socket;
const URL =
  process.env.REACT_APP_SOCKET_ENDPOINT || "http://localhost:5000/api/game";

const initiateConnect = () => {
  socket = io(URL, {
    transports: ["websocket"],
  });
  console.log(`Connecting socket...`);
};
const disconnect = () => {
  console.log("Disconnecting socket...");
  if (socket) socket.disconnect();
};
//disconniction events handlers
const desConnection = (discFun) => {
  socket.on("disconnect", () => {
    return discFun();
  });
};

const createGame = (data) => {
  if (!socket) return false;
  socket.on("connect", () => {
    socket.emit("createGame", data);
  });
};

const joinGame = (data) => {
  if (!socket) return false;
  socket.on("connect", () => {
    socket.emit("join", data);
  });
};

export { initiateConnect, disconnect, desConnection, createGame, joinGame };

// const enterRoom = (data) => {
//   if (data.user.status === "owner") {
//     console.log("own");
//     socket.emit("createGame", {
//       roomcode: data.roomcode,
//       roomname: data.roomname,
//       userId: data.user.id,
//     });
//   } else {
//     console.log("user");
//     socket.emit("join", {
//       username: data.user.name,
//       roomcode: data.roomcode,
//     });
//   }
// };

// const subscribeAddedUser = (subAddUsr) => {
//   if (!socket) return false;
//   socket.on("connect", () => {
//     console.log("Socket connected. Registering addedUser listener.");
//     socket.on("addedUser", (resData) => {
//       subAddUsr(null, resData);
//     });
//   });
// };

// const subscribeStartGame = (cb) => {
//   socket.emit("my message", "Hello there from React.");
//   if (!socket) return true;
//   socket.on("my broadcast", (msg) => {
//     console.log("Websocket event received!");
//     return cb(null, msg);
//   });
// };

// export const subscribeToChat = (cb) => {
//   socket.emit("my message", "Hello there from React.");
//   if (!socket) return true;
//   socket.on("my broadcast", (msg) => {
//     console.log("Websocket event received!");
//     return cb(null, msg);
//   });
// };

// // Handle message receive event
// export const subscribeToMessages = (cb) => {
//   if (!socket) return true;
//   socket.on("message", (msg) => {
//     console.log("Room event received!");
//     return cb(null, msg);
//   });
// };

// export const joinRoom = (roomName) => {
//   socket.emit("join", roomName);
// };

// export const sendMessage = ({ message, roomName }, cb) => {
//   if (socket) socket.emit("message", { message, roomName }, cb);
// };
