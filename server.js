const path = require("path");
const http = require("http");
const socketio = require("socket.io");
require("dotenv").config();
const app = require('./src/app');
const server = http.createServer(app);
const { initSocket } = require('./socket'); // Import the initSocket function

const io = socketio(server);
initSocket(io); // Call initSocket with the Socket.io instance

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});