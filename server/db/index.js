const { v4: uuidv4 } = require("uuid");
const connect = require("@databases/sqlite");
const { sql } = require("@databases/sqlite");
const db = connect();

//create tables
async function initialTables() {
  try {
    await db.query(sql`
    CREATE TABLE IF NOT EXISTS rooms (
      id VARCHAR NOT NULL PRIMARY KEY,
      name VARCHAR NOT NULL UNIQUE,
      code VARCHAR NOT NULL CHECK(length(code) >= 6 AND length(code) <= 15) UNIQUE,
      roomState INTEGER DEFAULT 0 CHECK(roomState IN (0, 1)),
      questionCount INTEGER DEFAULT 5 CHECK(questionCount > 2 AND questionCount < 31),
      execut_time INTEGER DEFAULT 10 CHECK(execut_time > 4 AND execut_time < 36),
      created_at INTEGER DEFAULT CURRENT_TIMESTAMP
    );
  `);

    await db.query(sql`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR NOT NULL PRIMARY KEY,
      name VARCHAR NOT NULL UNIQUE,
      status VARCHAR NOT NULL CHECK(status IN ('owner', 'player')),
      correct_ans INTEGER DEFAULT 0,
      wrong_ans INTEGER DEFAULT 0,
      join_at INTEGER DEFAULT CURRENT_TIMESTAMP,
      currentRoomId VARCHAR REFERENCES rooms(id) ON DELETE SET NULL,
      FOREIGN KEY (currentRoomId) REFERENCES rooms(id) ON UPDATE CASCADE
    );
  `);
    console.log("Table created successfully!");
  } catch (error) {
    console.log(error);
  }
}

//add data to tables
async function addRoom(name, code, questionCount = 5, execut_time = 10) {
  const id = uuidv4();
  await db.query(sql`INSERT INTO rooms 
      (id, name, code, questionCount, execut_time) VALUES 
      (${id}, ${name}, ${code}, ${questionCount}, ${execut_time});`);
  return id;
}
async function addUser(id, name, status, currentRoomId) {
  await db.query(sql`INSERT INTO users 
      (id, name, status, currentRoomId) VALUES 
      (${id}, ${name}, ${status}, ${currentRoomId});`);
  return id;
}

//get data from tables
async function getRooms(id, name, code) {
  try {
    let results;
    if (id) {
      results = await db.query(sql`
        SELECT * FROM rooms WHERE id=${id};
      `);
    } else if (code) {
      results = await db.query(sql`
        SELECT * FROM rooms WHERE code=${code};
      `);
    } else if (name) {
      results = await db.query(sql`
        SELECT * FROM rooms WHERE name=${name};
      `);
    } else {
      results = await db.query(sql`SELECT * FROM rooms;`);
    }
    if (results.length) {
      return results;
    } else {
      return undefined;
    }
  } catch (error) {
    console.log("getRoomError", error);
  }
}
async function getUser(id, name, currentRoomId) {
  try {
    let results;
    if (id) {
      results = await db.query(sql`
        SELECT * FROM users WHERE id=${id};
      `);
    } else if (name) {
      results = await db.query(sql`
        SELECT * FROM users WHERE name=${name};
      `);
    } else if (currentRoomId) {
      results = await db.query(sql`
        SELECT * FROM users WHERE currentRoomId=${currentRoomId};
      `);
    } else {
      results = await db.query(sql`
        SELECT * FROM users;
      `);
    }
    if (results.length) {
      return results;
    } else {
      return undefined;
    }
  } catch (error) {
    console.log(error);
  }
}

async function startRoomGame(id) {
  await db.query(sql`
    UPDATE rooms
      SET (roomState)
      = ('1')
      WHERE id=${id}
  `);
}

// update data non finished
async function updateRoom(id, ...data) {
  try {
  } catch (error) {
    console.log(error);
  }
}
async function updateUser(id, ...data) {
  try {
  } catch (error) {
    console.log(error);
  }
}

//remove
async function removeRoom(id) {
  await db.query(sql`
    DELETE FROM rooms WHERE id=${id};
  `);
}
async function removeUser(id) {
  await db.query(sql`
    DELETE FROM users WHERE id=${id};
  `);
  return id;
}

module.exports = {
  initialTables,
  addRoom,
  addUser,
  getRooms,
  getUser,
  removeRoom,
  removeUser,
  startRoomGame,
};

// async function run() {
//   console.log(await get('name'));
//   await set('name', 'Forbes');
//   console.log(await get('name'));
//   await set('name', 'Forbes Lindesay');
//   console.log(await get('name'));
//   remove('name');
// }
// run().catch((ex) => {
//   console.error(ex.stack);
//   process.exit(1);
// });

//
// class Game {
//     constructor(){
//         this.games = []
//     }

//     generateId(){
//         return uuidv4();
//     }
// }

// class RoomManager extends Game {
//     constructor(){
//         super();
//         this.rooms = [];
//     }

//     isExistRoomByCode(code){
//         if(this.rooms.length==0) return false;
//         const roomCodes = this.rooms.filter(room=> room.code==code)
//         if(roomCodes.length>0)
//             return true;
//         else return false;
//     }

//     isExistRoomByName(name){
//         if(this.rooms.length==0) return false;
//         const roomNames = this.rooms.filter(r=>r.name==name);
//         if(roomNames.length>0) return true;
//         else return false;
//     }
//     isExistRoomByUserName(username, code){
//         const roomNames = this.rooms.filter(r=>r.code==code);
//         const roomusers = roomNames[0]?.players.filter(r=>r.name==username);
//         if(roomusers.length>0) return roomusers;
//         else return false;
//     }

//     isAdminByRoomcode(code, userId){
//         const roomNames = this.rooms.filter(r=>r.code==code);
//         const roomusers = roomNames[0].players.filter(r=>r.id==userId);
//         if(roomusers[0]?.status=="owner") return true;
//         else return false;
//     }

//     addSocketIdToAdmin(username, code, socketId){
//         const roomNames = this.rooms.filter(r=>r.code==code);
//         const roomusers = roomNames[0].players.filter(r=>r.name==username);
//         if(roomusers.length>0 && roomusers[0].status=="owner"){
//             roomusers[0].socketId=socketId;
//             return true;
//         }
//         else return false;
//     }

//     getRoomUsers(roomcode){
//         const room = this.rooms.filter(r=>r.code==roomcode);
//         return room[0]?.players;
//     }

//     createRooms(creater, name, code){
//         if(this.isExistRoomByName(name)) return { userError: {ok: false, error: "The room name already exists."}};
//         if(this.isExistRoomByCode(code)) return {userError: {ok: false, error: "The room code already exists."}};

//         const id = this.generateId()
//         let newRoom = {
//             creater: {name: creater, id: id},
//             messages: [],
//             name: name,
//             code: code,
//             roomState: false,
//             players: [{name: creater, id: id, status: "owner"}]
//         }

//         this.rooms.push(newRoom);
//         return {
//             roomData: {
//                 roomcode: newRoom.code,
//                 roomname: newRoom.name,
//                 user: {name: creater, id: id, status: "owner"}
//             }
//         };
//     }
//     createRoomAddSocketId(createrId, socketId, code){
//         const roomIndex = this.rooms.findIndex(r=>r.code==code);
//         const createrIndex = this.rooms[roomIndex].players.findIndex(r=>r.id==createrId);
//         this.rooms[roomIndex].players[createrIndex].socketId = socketId;
//     }

//     joinRoom(code, name){
//         if(this.rooms.length==0)  return {userError: {ok: false, error: "There is no available game."}};
//         if(!this.isExistRoomByCode(code)) return {userError: {ok: false, error: "No such room"}};
//         if(this.isExistRoomByUserName(name, code)) return {userError: {ok: false, error: "The username already exists."}};

//         const id = this.generateId()
//         let playerIndex = this.rooms.findIndex((r)=> r.code === code)
//         if(this.rooms[playerIndex].roomState) return {userError: {ok: false, error: "This room games already started"}};
//         this.rooms[playerIndex].players.push({name: name, id: id, status: "player"})
//         return  {
//             users: this.rooms[playerIndex].players,
//             roomData: {
//                 roomcode: this.rooms[playerIndex].code,
//                 roomname: this.rooms[playerIndex].name,
//                 user: {name: name, id: id, status: "player"}
//             }};
//     }
//     joinRoomAddSocketId(username, socketId, code){
//         const roomIndex = this.rooms.findIndex(r=>r.code==code);
//         const createrIndex = this.rooms[roomIndex].players.findIndex(r=>r.name==username);
//         this.rooms[roomIndex].players[createrIndex].socketId = socketId;
//     }

//     startGame(code, creator){
//         if(this.rooms.length==0)  return {userError: {ok: false, error: "There is no available game."}};
//         if(!this.isExistRoomByCode(code)) return {userError: {ok: false, error: "No such room"}};
//         if(this.isExistRoomByUserName(creator, code)[0].status !=="owner") return {userError: {ok: false, error: "Only the owner can start a game."}};
//         let roomIndex = this.rooms.findIndex((r)=> r.code === code)
//         if (this.rooms[roomIndex].roomState) return {userError: {ok: false, error:"This room game already started"}};
//         this.rooms[roomIndex].roomState = true
//         return true;
//     }

//     leveFromRoom(socketId){
//         for (let i = 0; i < this.rooms.length; i++) {
//             for (let j = 0; j < this.rooms[i].players.length; j++) {
//                 if(this.rooms[i].players[j].socketId=socketId){
//                     this.rooms[i].players.slice(j,1)[0]
//                     return {users: this.rooms[i].players, roomcode: this.rooms[i].code}
//                 }
//             }
//         }
//         return  null
//     }
// }

// const roomManager = new RoomManager();

// module.exports = roomManager
