//import lib from node_modules
const express = require("express");
const http = require("http");
const path = require('path');
const { Server } = require("socket.io");

//import lib from custom files
const {initialTables} = require('./db/index');
const routers = require('./routers/index');

const app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const io = new Server(server, { cors: { origin: "*"} });
initialTables().catch(ex=>{
  console.log(ex);
})

routers(app, io)

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:5000/`);
});
