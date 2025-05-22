const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const dotenv = require('dotenv')
const router = require('./routes/userRoutes')
const blogRoutes = require("./routes/blogs");
const Filerouter = require('./routes/fileRoutes')
const path = require("path");
const http = require('http')
const { Server } = require('socket.io')
const app = express();
dotenv.config();
// creating server for frontend requests
const server = http.createServer(app);
app.use(cors({
    origin: 'https://682f6f0042538d1b69ee543b--dainty-panda-21fcd9.netlify.app',
    credentials: true
}));
app.use(express.json())
connectDB();


app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/blogs", blogRoutes);
app.use('/files', Filerouter)
app.get('/', (req, res) => {
    res.send('this is our backend')
})
app.use('/user', router);


// creating io connections 

const io = new Server(server, {
    cors: {
        origin: 'https://682f6f0042538d1b69ee543b--dainty-panda-21fcd9.netlify.app', // Change this for production security
        methods: ["GET", "POST"],
        credentials:true
    },
});

const userSocketMap = {};
console.log(userSocketMap)
const getAllConnectedClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId]?.username,
            role: userSocketMap[socketId]?.role || "viewer",
        };
    });
};
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join', ({ roomId, username }) => {
        // Store roomId in userSocketMap
        const clients = getAllConnectedClients(roomId);
        const isAdmin = clients.length === 0;

        userSocketMap[socket.id] = { username, role: isAdmin ? "admin" : "viewer", roomId };
        socket.join(roomId);

        const updatedClients = getAllConnectedClients(roomId);

        io.to(socket.id).emit("joined", {
            clients: updatedClients,
            username,
            socketId: socket.id,
            role: userSocketMap[socket.id].role,
        });

        clients.forEach(({ socketId }) => {
            io.to(socketId).emit("joined", {
                clients: updatedClients,
                username,
                socketId: socket.id
            });
        });

        console.log(`User ${username} joined room ${roomId} as ${userSocketMap[socket.id].role}`);
    });
    

    socket.on('grant-write', ({ roomId, targetSocketId }) => {
        console.log("Granting write access to", targetSocketId);

        const sender = userSocketMap[socket.id];
        const target = userSocketMap[targetSocketId];

        console.log('Sender ID:', socket.id);
        console.log('Sender role:', sender?.role);
        console.log('Target ID:', targetSocketId);
        console.log('Target exists:', !!target);

        // Validate roles and map
        if (sender?.role === 'admin' && target && target.roomId === roomId) {
            target.role = 'writer';
            io.to(targetSocketId).emit('write-access-granted');

            const updatedClients = getAllConnectedClients(roomId);
            io.in(roomId).emit('clients-updated', { clients: updatedClients });

            console.log(`Write access granted to ${targetSocketId}`);
        } else {
            console.log('Grant failed — check roles or socket map');
        }
    });

    socket.on('code-change', ({ roomId, code }) => {
        const role = userSocketMap[socket.id]?.role;
        if (role === 'admin' || role === 'writer') {
            socket.in(roomId).emit('code-change', { code });
        }
    });

    socket.on('sync-code', ({ socketId, code }) => {
        io.to(socketId).emit('code-change', { code });
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit('disconnected', {
                socketId: socket.id,
                username: userSocketMap[socket.id]?.username,
            });
        });

        console.log(`User ${socket.id} disconnected.`);
        delete userSocketMap[socket.id];
    });
});

server.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT} `);
});