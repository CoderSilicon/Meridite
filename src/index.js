import { Server } from "socket.io";
import { createServer } from "node:http";

const PORT = process.env.PORT || 3000;
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Join a room based on the code
  socket.on("create-room", ({ code }) => {
    socket.join(code);
    console.log(`Sender joined room: ${code}`);
    socket.emit("room-created", { code });
  });

  socket.on("join-room", ({ code }) => {
    socket.join(code);
    console.log(`Receiver joined room: ${code}`);
    // Notify the sender that the receiver is ready
    socket.to(code).emit("receiver-joined");
  });

  socket.on("offer", ({ code, offer }) => {
    socket.to(code).emit("offer", offer);
  });

  socket.on("answer", ({ code, answer }) => {
    socket.to(code).emit("answer", answer);
  });

  socket.on("candidate", ({ code, candidate }) => {
    socket.to(code).emit("candidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log("✅ Signaling server running on port 3000");
});