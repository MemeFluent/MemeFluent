# MemeFluent
Alex Wallace
Lily Tran
Peter Chung

#Functionality and Stack
A webapp to communicate through memes

-We used Node.js, Express, mongodb, bootsrap, Socket IO
 HTML5, and CSS for this project.

-We added multiple sections including your typical
 Home and About web pages

-The main feature is the chatroom where users can
 send a meme as a message to other users
 
-The chatroom can host multiple users and will
 broadcast whether a user is currently typing
 
-The chat logs are backed up in a database at
 monogodb through dbconnect.js
 
-The number of users online can be displayed

#Issues 
 -Spent a lot of time figuring out how to use Web
  Socket Programming for the chatroom feature while
  also trying to back up these chats in the mongodb
  database. We opted for a plugin extension to store
  and view past chats
 
 -Since this was the first time we used an api, we 
  struggled a lot on how to combine the Socket IO api
  with the Gfycat Api. Since client side code in Node.js
  cannot run the code from the API we tried to run it 
  on the server side code. Unfortunately, we could not
  parse the JSON object generated from the search to be
  sent back to the client side code to interpret and 
  display. We instead just hardcoded memes for the users
  to select and send to the chat.
 
#Features Not Implemented
-A button in chatroom to search for desired sticker,
 gif, or meme to post. The main problem was figuring
 out how to use the Gfycat API whose documentation
 was terrible and unreadable. If we had enough time,
 then we would have chosen a different api to search
 for the appropriate meme
  
-Login feature to allow only registered users for the 
 chat. However, still some bugs and not enough time to
 fully implement.
 
-Meme generator feature for users to build memes and 
 post it in chatroom. Not enough time to completely
 implement, but experimented with code.
 
 #References Used to Help Develop Code
-https://dev.to/rexeze/how-to-build-a-real-time-chat-app-with-nodejs-socketio-and-mongodb-2kho
 
-https://www.cssscript.com/responsive-meme-generator/