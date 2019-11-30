const express = require("express");
const app = express();
const dateTime = require("simple-datetime-formater");
const bodyParser = require("body-parser");
const chatRouter = require("./route/chatroute");
const loginRouter = require("./route/loginRoute");

const http = require("http").Server(app);

const io = require("socket.io");

const port = 5000;

app.use(bodyParser.json());

app.use("/chats", chatRouter);
app.use("/login", loginRouter);

app.use(express.static(__dirname + "/public"));

socket = io(http);

const Chat = require("./models/Chat");
const connect = require("./dbconnect");

http.listen(port, () => {
  console.log("Running on Port: " + port);
});
