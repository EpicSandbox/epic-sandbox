const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

// TODO(drysea): Separate out into a different file
class GameState {
  constructor(){
    this.users = {}
  };

  addPlayer(user){
    if (!this.users[user]) {
      this.users[user] = {}
    };

    console.log(`Users in game: ${Object.keys(this.users)}`)
  }

  updateState(user, message){
    // Strip out `$`
    message = message.substring(1);
    let command = message.split(' ');

    if (command[0] === 'start'){
      console.log(`Game Starting...`);
    } else if (command[0] === 'add_roles') {
      // Expect a comma delimited list after this in format 1town,2maf etc.
      console.log(`Setting up roles...`);
      
    }
  }
};

/**
 * Organizing state by separating out into games
 * Each game needs to have it's own state, we can handle it via hashmap key => roomId, {GameState}
 */
let roomState = new GameState();

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
  // playerNum++;
  // if(gameState === 0 && playerNum === 2){
  //   startGame();
  // }
  roomState.addPlayer(socket.id);

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    console.log('New Message Received: ' + data)
    messageText = data.body;
    user = data.senderId;
    /**
     * Will also for now co-op sending messages by using them as commands.
     * If messages start with '$'
     */
    if (messageText[0] == '$') {
      roomState.updateState(user, messageText)
    } else {
      io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
    }
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

