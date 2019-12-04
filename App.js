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

const port = 5000;

//use bodyParser middleware
app.use(bodyParser.json());

app.use("/chats", chatRouter);
app.use("/login", loginRouter);

app.use(express.static(__dirname + "/public"));

socket = io(http);

//connect to the database
const Chat = require("./models/Chat");
const connect = require("./dbconnect");

socket.on("connection", socket => {
  console.log("user connected");

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

  socket.on("chat message", function(msg, usr) {
    console.log("message: " + msg);

    socket.broadcast.emit("received", { message: msg, user: usr });

//connect to gfycat API
    const Gfycat = require('gfycat-sdk');
    const clientId = '2_MPWi0c';
    const clientSecret = 'b00UBk0XV_AAeMNwa3wqxUxdb1vaQfAaGjYCRCx3FUf_bMzAZUi8OQA4Lp1QIJu8';
    var gfycat = new Gfycat({clientId: clientId, clientSecret: clientSecret});
/*
//gfycat API authentication
    gfycat.authenticate((err, data) => {
      //Your app is now authenticated
      assert.equal(data.access_token, gfycat.token);
      console.log('token', gfycat.token);
    });

    gfycat.authenticate().then(res => {
      //Your app is now authenticated
      assert.equal(res.access_token, gfycat.token);
      console.log('token', gfycat.token);
    });
*/
//save the chat to the database
    connect.then(db => {
      console.log("connected correctly to the server");
      let chatMessage = new Chat({ message: msg, sender: "Anonymous" });

      chatMessage.save();
    });
  });
});

http.listen(port, () => {
  console.log("Running on Port: " + port);
});

