const express  = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes.js");
const messageRoute = require("./routes/messagesRoute.js");
const socket = require('socket.io');

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

try {
    mongoose.connect(`${process.env.dbUrl}/${process.env.dbName}`)
    console.log("Db Connected Successfully")
} catch (error) {
    res.status(500).send({message:"Internal Server Error",
        error:error.message
        })
    console.log(error)
}

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);

const server = app.listen(PORT,
    () => {
        console.log(`Server is running on the port ${PORT}`);
    })

const io = socket(server,{
    cors:{
        origin:"http://localhost:3000",
        credentials: true,
    }
});
global.onlineUsers = new Map();

 io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        // console.log("sendmsg", { data });
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-receive", data.message);
        }
    })
 })    