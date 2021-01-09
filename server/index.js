const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

//0 for pregame, 1 for active, 2 for game over.
let gameState = 0;

let playerNum = 0;

function startGame(){
  gameState = 1;
  console.log(`game started! gameState: ${gameState}`);
}

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);

  // Join a conversation
  const { roomId } = socket.handshake.query;
  socket.join(roomId);
  playerNum++;
  if(gameState === 0 && playerNum === 2){
    startGame();
  }

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} diconnected`);
    socket.leave(roomId);
    playerNum--;
    
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
