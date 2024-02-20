import { io } from "socket.io-client";

let socket;
const URL =
  process.env.REACT_APP_SOCKET_ENDPOINT || "http://localhost:5000/api/game";

const initiateConnect = () => {
  socket = io(URL, {
    transports: ["websocket"],
  });
  socket.on("connect", () => {
    console.log(`Connecting socket...`);
  });
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

const subscribeBeforeStartEvents = (subAddUsr) => {
  if (!socket) return false;
  socket.on("errMsg", (errData) => {
    return subAddUsr(errData);
  });
  socket.on("gameSuccCreate", (resData) => {
    return subAddUsr(null, "gameSuccCreate", resData);
  });
  socket.on("gameSuccJoined", (resData) => {
    return subAddUsr(null, "gameSuccJoined", resData);
  });
  socket.on("addedUser", (resData) => {
    return subAddUsr(null, "addedUser", resData);
  });
};

const subscribeAfterStartEvents = (subAfterEv) => {
  if (!socket) return false;
  socket.on("gameStarting", (resData) => {
    return subAfterEv(null, "gameStarting", resData);
  });
  socket.on("question", (resData) => {
    return subAfterEv(null, "question", resData);
  });

  socket.on("playerAnswered", (resData) => {
    return subAfterEv(null, "playerAnswered", resData);
  });

  socket.on("endQuiz", (resData) => {
    return subAfterEv(null, "endQuiz", resData);
  });
};

const createGame = (data) => {
  if (!socket) return false;
  socket.emit("createGame", data);
};

const joinGame = (data) => {
  if (!socket) return false;
  socket.emit("join", data);
};

const startGameEmit = (userId) => {
  if (!socket) return false;
  socket.emit("startGame", userId);
};

const sendAnswer = (data) => {
  if (!socket) return false;
  socket.emit("answer", data);
};

export {
  initiateConnect,
  disconnect,
  desConnection,
  subscribeBeforeStartEvents,
  subscribeAfterStartEvents,
  createGame,
  joinGame,
  startGameEmit,
  sendAnswer,
  
};