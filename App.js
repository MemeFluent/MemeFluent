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

socket.on("connection", socket => {
  console.log("user connected");

  socket.on('username', function(username) {
    socket.username = username;
    io.emit('is_online', '🔵 <i>' + socket.username + 'is joining the chat..</i>');
  });

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  socket.on("typing", data => {
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
    console.log("message: " + msg);

    socket.broadcast.emit("received", { message: msg, user: usr });

//save the chat to the database
//    connect.then(db => {
//      console.log("connected correctly to the server");
//      let chatMessage = new Chat({ message: msg, sender: "Anonymous" });
//
//      chatMessage.save();
//    });
  });
});

http.listen(port, () => {
  console.log(`MemeFluent is up and running!  Click here: http://${host}:${port}/`);
});

