const router = require("express").Router();
const {
  addRoom,
  addUser,
  getRooms,
  getUser,
  removeUser,
  removeRoom,
  startRoomGame,
} = require("../db/index");
const {
  createVaidator,
  joinGameValidator,
  startGameFromOwner,
} = require("../db/validator");
const irregularVerbs = require("../db/files/irregularVerb.json");
const shuffle = require("../helper/shuffle");

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
            // io.of("/api/game").in(roomcode).emit("addedUser", [{name: username, id: socket.id, status: "owner" }]);
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

    socket.on("startGame", async (userId) => {
      console.log("userId", userId);
      const validRes = await startGameFromOwner(userId);
      if (validRes.error) {
        return socket.emit("errMsg", validRes.error.details[0].message);
      }
      const room = validRes.room;
      await startRoomGame(room.id);
      io.of("/api/game").in(room.code).emit("gameStarting", 5);
      setTimeout(()=>{
        runGiveQuest(room);
      }, 5000)
    });

    const runGiveQuest = async (room) => {
      const execut_time = room.execut_time;
      const questions = [];

      for (let i = 0; i < room.questionCount; i++) {
        const randWord =
          irregularVerbs[Math.floor(Math.random() * irregularVerbs.length)];
        const randQuestItem = Math.floor(Math.random() * 2);
        questions.push({
          word: randWord.word,
          quest: randQuestItem == 1 ? "ps" : "pp",
          answers: shuffle([randWord.ps, randWord.pp, randWord.word]),
          translation: randQuestItem.translation,
        });
      }

      let i = 1;
      io.of("/api/game")
        .in(room.code)
        .emit("question", {
          question: questions[i-1],
          config: {
            questionCount: room.questionCount,
            currentTest: i,
            execut_time: room.execut_time,
          },
        });
      const intervalId = setInterval(() => {
        io.of("/api/game")
          .in(room.code)
          .emit("question", {
            question: questions[i],
            config: {
              questionCount: room.questionCount,
              currentTest: i + 1,
              execut_time: room.execut_time,
            },
          });
        ++i;
        if (i == questions.length) {
          clearInterval(intervalId);
        }
      }, execut_time * 1000);
    };

    socket.on("answer", async (data) => {
      const userReting = [];
      const reqData = typeof data == "string" ? JSON.parse(data) : data;
      console.log(reqData);
      const {roomId, userId, question, answer} = reqData;

      io.of("/api/game")
        .in(room.code)
        .emit("playerAnswered", { question: "questions[i]" });
    });

    // Socket yopilganda
    socket.on("disconnect", async () => {
      const leavedUser = await getUser(socket.id);
      if (leavedUser?.length > 0) {
        const roomId = leavedUser[0]?.currentRoomId;
        await removeUser(socket.id);
        const users = await getUser(null, null, roomId);
        if (users?.length > 0) {
          const roomcode = await getRooms(roomId);
          io.of("/api/game").in(roomcode[0].code).emit("leaveGame", users);
        } else {
          //if all user left in room
          await removeRoom(roomId);
        }
      }
      console.log("disconnected:", socket.id);
    });
  });

  return router;
};
