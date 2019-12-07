var socket = io();
var messages = document.getElementById("messages");
var username = "test";

(function() {
  $("form").submit(function(e) {
    var value = $('#message');

    if ($(value).val().trim() !== "") {
      let li = document.createElement("li");
      e.preventDefault();
      socket.emit("chat message", $(value).val(), username);

      messages.appendChild(li).append($(value).val());
      let span = document.createElement("span");
      messages.appendChild(span).append("by " + username);

      $("#message").val("");
    }
    return false;
  });

  socket.on("received", data => {
    let li = document.createElement("li");
    let span = document.createElement("span");
    var messages = document.getElementById("messages");
    messages.appendChild(li).append(data.message);
    messages.appendChild(span).append("by " + data.user);
    console.log("received message");
  });
})();

(function() {
  fetch("/chats")
    .then(data => {
      return data.json();
    })
    .then(json => {
      json.map(data => {
        let li = document.createElement("li");
        let span = document.createElement("span");
        messages.appendChild(li).append(data.message);
        messages
          .appendChild(span)
          .append("by " + data.sender + ": " + formatTimeAgo(data.createdAt));
      });
    });
})();

let messageInput = document.getElementById("message");
let typing = document.getElementById("typing");

messageInput.addEventListener("keypress", () => {
  socket.emit("typing", { user: "Someone", message: "is typing..." });
});

socket.on("notifyTyping", data => {
  typing.innerText = data.user + " " + data.message;
  console.log(data.user + data.message);
});

messageInput.addEventListener("keyup", () => {
  socket.emit("stopTyping", "");
});

socket.on("notifyStopTyping", () => {
  typing.innerText = "";
});

socket.on("newUser", data => {
  $("#userNum").innerText = parseInt($("#userNum").innerText) + 1;
  $('#messages').append("<br><span>(°ロ°)☝"+data.user+" joins the chat</span>");
});

socket.on("remUser", data => {
  $("#userNum").innerText = parseInt($("#userNum").innerText) - 1;
  $('#messages').append("<br><span>(・ω・)ノ"+data.user+" has left the chat</span>");
});

socket.on("meme", data => {
  let img = document.createElement("img");
  let span = document.createElement("span");
  var messages = document.getElementById("messages");
  img.src = data.meme;
  messages.appendChild(document.createElement("br"));
  messages.appendChild(img);
  messages.appendChild(document.createElement("br"));
  messages.appendChild(span).append("by " + data.user);
  console.log("received message");
});

function getUsername(){ 
    username=prompt("Please enter your user name","Peter");
    if(!username){
      username = "Anonymous";
    }
    $('#messages').append("<br><span>(°ロ°)☝"+username+" joins the chat</span>");
    socket.emit("newUser", username);
}

$(document).ready(function(){ //sets all images to clickable with the function to send to server
    $('img[class=preview]').each(function() {
        $(this).click(function(){
          $('#messages').append("<br> <img alt='displayMeme' src='"+$(this).attr('src')+"'><br><span>by "+username+"</span>");
          socket.emit("meme", $(this).attr('src'), username);
        });
    });
});