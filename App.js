//use express
const express = require("express");
const app = express();
const dateTime = require("simple-datetime-formater");
const bodyParser = require("body-parser");
const chatRouter = require("./route/chatroute");
const loginRouter = require("./route/loginRoute");

const http = require("http").Server(app);

//use socket.io module
const io = require("socket.io");

const host ='localhost';
const port = 5000;

//use bodyParser middleware
app.use(bodyParser.json());

app.use("/chats", chatRouter);
app.use("/login", loginRouter);

app.use(express.static(__dirname + "/public"));

socket = io(http);

//connect to gfycat API
const Gfycat = require('gfycat-sdk');
const client = '2_MPWi0c';
const secret = 'b00UBk0XV_AAeMNwa3wqxUxdb1vaQfAaGjYCRCx3FUf_bMzAZUi8OQA4Lp1QIJu8';
var gfycat = new Gfycat({clientId: client, clientSecret: secret});

//search for trending gifs
let options = {
  count: 10,
  cursor: ''
};

//gfycat.trendingGifs(options).then(data => console.log(data));

//connect to the database
const Chat = require("./models/Chat");
const connect = require("./dbconnect");

var userNum = 0;

var userList = [];

socket.on("connection", socket => {
  console.log("user connected");
  userNum = userNum+1;
  var username = "test";
  socket.broadcast.emit("userNum", {num: userNum, list: userList});

  socket.on("newUser", function(usr){
    userList.push(usr);
    socket.broadcast.emit("newUser", {user: usr, num: userNum, list: userList});
    username = usr;
    
    console.log(userList);
  });

  socket.on("disconnect", function() {
    console.log("user disconnected");
    userNum = userNum-1;
    console.log(userNum);
    socket.broadcast.emit("remUser", {user: username, num: userNum, list: userList});
    console.log(userList);
    userList.splice(userList.indexOf(username), 1);
    console.log(userList);
  });

  socket.on("typing", data => {
    socket.broadcast.emit("userNum", {num: userNum, list: userList});
    socket.broadcast.emit("notifyTyping", {
      user: data.user,
      message: data.message
    });
  });

  socket.on("stopTyping", () => {
    socket.broadcast.emit("notifyStopTyping");
  });

  socket.on("meme", function(data, usr){
    console.log(data);
    socket.broadcast.emit("meme", {
      user: usr,
      meme: data
    });
  });

  socket.on("chat message", function(msg, usr) {
    socket.broadcast.emit("userNum", {num: userNum, list: userList});
    console.log(usr + "'s message: " + msg);

    socket.broadcast.emit("received", { message: msg, user: usr });

//save the chat to the database
    connect.then(db => {
      console.log(usr + " connected correctly to the server");
      let chatMessage = new Chat({ message: msg, sender: usr });

      chatMessage.save();
    });
  });
});

http.listen(port, () => {
  console.log(`MemeFluent is up and running!  Click here: http://${host}:${port}/`);
});

