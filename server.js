const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authenticateToken = require('./middleware/authentication')
const { sequelize } = require('./models');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/user');
// const userRoutes = require('./public');
const path = require('path')


const app = express();
app.use(bodyParser.json());



app.use(cors());
// Your Sequelize initialization code goes here
// app.use(express.static(path.join(__dirname,'public')))
// app.use("/public/User/",express.static('public'))
app.use('/api', userRoutes);
app.use('/api',authenticateToken, chatRoutes);

app.use(express.static(path.join(__dirname, 'public', 'User')));

// Your API routes go here

// For any other route, serve the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'User', 'index.html'));
});
// Start the server
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);


const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});


io.on('connection', (socket) => {

  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => {
    console.log(room, "this is a typing room")
    socket.in(room).emit("typing")});

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));


  socket.on("new message", (newMessageRecieved) => {
    var receiver = newMessageRecieved.receiverId;
    if (!receiver){ console.log("chat users not defined")}
    else{socket.in(receiver).emit("message recieved", newMessageRecieved);}

  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});


// Handle server shutdown gracefully
process.on('SIGINT', async () => {
  console.log('\nClosing server and database connections...');
  await sequelize.close();
  process.exit();
});
