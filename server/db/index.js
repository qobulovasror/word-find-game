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
      grade INTEGER DEFAULT 0,
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
async function updateGradeUser(id, grade, roomId) {
  const userdata  = await getUser(id);
  let oldgrade = userdata[0].grade;
  await db.query(sql`
  UPDATE users
  SET (grade)
  = (${grade+oldgrade})
  WHERE id=${id}
  `);
  const users = await getUser(null, null, roomId)
  return users
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
async function removeUserByRoomId(currentRoomId) {
  await db.query(sql`
    DELETE FROM users WHERE currentRoomId=${currentRoomId};
  `);
  return currentRoomId;
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
  updateGradeUser,
  removeUserByRoomId
};
