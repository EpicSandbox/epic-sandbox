const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const PHASES = ["Night", "Day"];

// TODO(drysea): Separate out into a different file
class GameState {
  constructor(){
    this.users = {};
    this.gameStarted = false;
    this.currentDay = 1;
    this.currentPhase = "Night";
  };

  /**
   * addPlayer - Adds a player to the current game for the room.
   * @param {*} user 
   * @returns 
   */
  addPlayer(user){
    // Can't add more players if game started
    if (this.gameStarted) {
      return;
    }

    // Instantiate new user object (generic dict for now)
    if (!this.users[user]) {
      this.users[user] = {};
    };

    console.log(`Users in game: ${Object.keys(this.users)}`)
  }

  /**
   * removePlayer - Removes a player from the current game.
   * @param {*} user 
   */
  removePlayer(user){
    delete this.users[user];
  }

  /**
   * selectAction - Main method for allowing an user to select an action to do.
   * @param {*} user 
   * @param {*} message 
   */
  selectAction(user, message){
    // Strip out `$`
    message = message.substring(1);
    let command = message.split(' ');
    let command_key = command[0]

    if (command_key === 'start'){
      console.log(`Game Starting...`);
    } else if (command_key === 'add_roles') {
      // Expect a comma delimited list after this in format 1town,2mafia,3third
      // Expect a value for each.
      console.log(`Setting up roles...`);
    } else if (command_key == 'vote') {

    } else if (command_key == 'lynch') {

    } else if (command_key == 'kill') {

    } else if (command_key == 'secondary_action') {

    }
  }

  /**
   * endPhase - To trigger the resolution of all phases.
   */
  endNightPhase(){
    itemPhase();
    conversionPhase();
    killPhase();
    investigationPhase();
  }

  endDayPhase(){
    lynchPhase();
    postLynchPhase(); // e.g. Gov Jailer
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
      messages_to_emit = roomState.selectAction(user, messageText);

    } else {
      io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
    }
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} diconnected`);
    socket.leave(roomId);
    roomState.removePlayer(socket.id)
    playerNum--;
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

