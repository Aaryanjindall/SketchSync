import { WebSocket, WebSocketServer } from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch(e) {
    return null;
  }
  return null;
}

wss.on('connection', function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  const userId = checkUser(token);

  if (userId == null) {
    ws.close()
    return null;
  }

  users.push({
    userId,
    rooms: [],
    ws
  })

  ws.on('message', async function message(data) {
  try {
    let parsedData;

    if (typeof data !== "string") {
      parsedData = JSON.parse(data.toString());
    } else {
      parsedData = JSON.parse(data);
    }

    console.log("message received");
    console.log(parsedData);

    const currentUser = users.find(x => x.ws === ws);
    if (!currentUser) return;

    // JOIN ROOM
    if (parsedData.type === "join_room") {
      currentUser.rooms.push(parsedData.roomId);
      return;
    }

    // LEAVE ROOM
    if (parsedData.type === "leave_room") {
      currentUser.rooms = currentUser.rooms.filter(
        x => x !== parsedData.roomId
      );
      return;
    }

    // CHAT MESSAGE
    if (parsedData.type === "chat") {

      const roomId = Number(parsedData.roomId);

      const room = await prismaClient.room.findUnique({
        where: { id: roomId }
      });

      if (!room) {
        ws.send(JSON.stringify({ error: "Room not found" }));
        return;
      }

      await prismaClient.chat.create({
        data: {
          message: parsedData.message,
          roomId: roomId,
          userId: currentUser.userId
        }
      });

      // Broadcast
      users.forEach(user => {
        if (user.rooms.includes(parsedData.roomId)) {
          user.ws.send(JSON.stringify({
            type: "chat",
            message: parsedData.message,
            roomId: parsedData.roomId
          }));
        }
      });
      return;
    }

    // CLEAR BOARD (admin only)
    if (parsedData.type === "clear") {
      const roomId = Number(parsedData.roomId);

      const room = await prismaClient.room.findUnique({
        where: { id: roomId }
      });

      if (!room) {
        ws.send(JSON.stringify({ error: "Room not found" }));
        return;
      }

      if (room.adminId !== currentUser.userId) {
        ws.send(JSON.stringify({ error: "Only room admin can clear board" }));
        return;
      }

      await prismaClient.chat.deleteMany({
        where: { roomId }
      });

      // Broadcast clear event to all users in this room
      users.forEach(user => {
        if (user.rooms.includes(String(roomId))) {
          user.ws.send(JSON.stringify({
            type: "clear",
            roomId: String(roomId)
          }));
        }
      });

      return;
    }

  } catch (err) {
    console.error("WS ERROR:", err);
    ws.send(JSON.stringify({
      error: "Internal Server Error"
    }));
  }
});


});
