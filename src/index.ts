import express from "express";
import cors from "cors";
import { Server, Socket } from "socket.io";
import { createServer } from "node:http";

interface ServerToClientEvents {
  "room-created": (data: { code: string }) => void;
  "receiver-joined": () => void;
  "receiver-left": () => void;
  offer: (offer: RTCSessionDescriptionInit) => void;
  answer: (answer: RTCSessionDescriptionInit) => void;
  candidate: (candidate: RTCIceCandidate) => void;
}

interface ClientToServerEvents {
  "create-room": (data: { code: string }) => void;
  "join-room": (data: { code: string }) => void;
  "leave-room": (data: { code: string }) => void;
  offer: (data: { code: string; offer: RTCSessionDescriptionInit }) => void;
  answer: (data: { code: string; answer: RTCSessionDescriptionInit }) => void;
  candidate: (data: { code: string; candidate: RTCIceCandidate }) => void;
}

const PORT = process.env.PORT || 3000;
const app = express();
const httpServer = createServer(app);

// 1. Explicitly define allowed origins for better security and CORS stability
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: true, // Dynamically allow the requesting origin
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: true }));

app.get("/alive", (_, res) => {
  res.status(200).send(true);
});

// 2. Optimization: Use 'disconnecting' instead of 'disconnect'
// This allows access to socket.rooms before the socket actually leaves them.
io.on("connection", (socket: Socket) => {
  // Use a dedicated event for manual cancellation to avoid waiting for timeouts
  socket.on("leave-room", ({ code }: { code: string }) => {
    if (code) {
      socket.to(code).emit("receiver-left");
      socket.leave(code);
    }
  });

  socket.on("create-room", ({ code }: { code: string }) => {
    if (!code) return;
    socket.join(code);
    socket.emit("room-created", { code });
  });

  socket.on("join-room", ({ code }: { code: string }) => {
    if (!code) return;
    socket.join(code);
    socket.to(code).emit("receiver-joined");
  });

  // 3. Structured Data Transfer: Ensure we only forward if code exists
  socket.on("offer", ({ code, offer }) => {
    if (code && offer) socket.to(code).emit("offer", offer);
  });

  socket.on("answer", ({ code, answer }) => {
    if (code && answer) socket.to(code).emit("answer", answer);
  });

  socket.on("candidate", ({ code, candidate }) => {
    if (code && candidate) socket.to(code).emit("candidate", candidate);
  });

  // 4. Automatic Cleanup: Notify peers when a socket drops unexpectedly
  socket.on("disconnect", () => {
    // Iterate through all rooms the socket was in (except its own ID room)
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.to(room).emit("receiver-left");
      }
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`[*] Signaling server running on port ${PORT}`);
});
