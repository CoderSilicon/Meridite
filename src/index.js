import { Server } from "socket.io";
import { createServer } from "node:http";


const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "*" } 
});

io.on("connection", (socket) => {
  // Join a room based on the code
  socket.on("create-room", ({ code }) => {
    socket.join(code);
    console.log(`Sender joined : ${code}`);
  });

  socket.on("join-room", ({ code }) => {
    socket.join(code);
    console.log(`Receiver joined : ${code}`);
    // Notify the sender that the receiver is ready for the offer
    socket.to(code).emit("receiver-joined");
  });

  // Relay WebRTC specific data
  socket.on("offer", ({ code, offer }) => {
    socket.to(code).emit("offer", offer);
  });

  socket.on("answer", ({ code, answer }) => {
    socket.to(code).emit("answer", answer);
  });

  socket.on("candidate", ({ code, candidate }) => {
    socket.to(code).emit("candidate", candidate);
  });
});

httpServer.listen(3000, () => {
  console.log(" Signaling server");
});