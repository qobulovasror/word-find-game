const router = require("express").Router();
const {
  addRoom,
  addUser,
  getRooms,
  getUser,
  removeUser,
  removeRoom,
  startRoomGame
} = require("../db/index");
const { createVaidator, joinGameValidator, startGameFromOwner } = require("../db/validator");

module.exports = (io) => {
  io.of("/api/game").on("connection", async (socket) => {
    console.log(`connected : ${socket.id}`);

    socket.on("createGame", async (data) => {
      try {
        const reqData = typeof data == "string" ? JSON.parse(data) : data;
        const validRes = await createVaidator(reqData);
        if (validRes.error) {
          return socket.emit("errMsg", validRes.error.details[0].message);
        }
        const { roomcode, roomname, questionCount, execut_time, username } =
          reqData;
        const addedRoom = await addRoom(
          roomname,
          roomcode,
          questionCount,
          execut_time
        );
        if (addedRoom) {
          addUser(socket.id, username, "owner", addedRoom).then(() => {
            socket.join(roomcode);
            socket.emit("gameSuccCreate", {
              roomcode: roomcode,
              roomname: roomname,
              user: { name: username, id: socket.id, status: "owner" },
            });
            io.of("/api/game").in(roomcode).emit("addedUser", [{name: username, id: socket.id, status: "owner" }]);
          });
        }
      } catch (error) {
        console.log(error);
        socket.emit("errMsg", String(error).split("SQLITE_CONSTRAINT")[1]);
      }
    });

    socket.on("join", async (data) => {
      const reqData = typeof data == "string" ? JSON.parse(data) : data;
      const { username, roomcode } = reqData;
      const validRes = await joinGameValidator(reqData);
      if (validRes.error) {
        return socket.emit("errMsg", validRes.error.details[0].message);
      }
      const addedRoomId = await getRooms(null, null, roomcode);
      const addeduserId = await addUser(
        socket.id,
        username,
        "player",
        addedRoomId[0].id
      );
      if (addeduserId) {
        socket.emit("gameSuccJoined", {
          roomcode: roomcode,
          roomname: addedRoomId[0].name,
          user: { name: username, id: socket.id, status: "player" },
        });

        socket.join(roomcode);
        const users = await getUser(null, null, addedRoomId[0].id);
        io.of("/api/game").in(roomcode).emit("addedUser", users);
      }

      
    });

    socket.on("startGame", async (data) => {
      const validRes = await startGameFromOwner(userId);
      if (validRes.error) {
        return socket.emit("errMsg", validRes.error.details[0].message);
      }
      const room = validRes.room;
      await startRoomGame(room.id);
      io.of("/api/game").in(room.code).emit("startGame", users);
    });

    // Socket yopilganda
    socket.on("disconnect", async () => {
      const leavedUser = await getUser(socket.id);
      if (leavedUser?.length > 0) {
        const roomId = leavedUser[0]?.currentRoomId;
        await removeUser(socket.id);
        const users = await getUser(null, null, roomId);
        const roomcode = await getRooms(roomId);
        io.of("/api/game").in(roomcode[0].code).emit("leaveGame", users);
      }
      console.log("disconnected:", socket.id);
    });
  });

  return router;
};
