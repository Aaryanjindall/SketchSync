import { WebSocket, WebSocketServer } from 'ws';
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string,
  name: string
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

wss.on('connection', async function connection(ws, request) {
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

  const dbUser = await prismaClient.user.findUnique({ where: { id: userId } });
  if (!dbUser) {
    ws.close();
    return;
  }

  users.push({
    userId,
    name: dbUser.name || "Anonymous",
    rooms: [],
    ws
  });

  ws.on('close', () => {
    const index = users.findIndex(user => user.ws === ws);
    if (index !== -1) {
      const leavingUser = users[index];
      users.splice(index, 1);
      
      leavingUser.rooms.forEach(roomIdStr => {
        const usersInRoom = users.filter(u => u.rooms.includes(roomIdStr)).map(u => ({ id: u.userId, name: u.name }));
        users.forEach(user => {
          if (user.rooms.includes(roomIdStr)) {
            user.ws.send(JSON.stringify({
              type: "active_users",
              users: usersInRoom,
              roomId: roomIdStr
            }));
          }
        });
      });
    }
  });

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
      const roomIdStr = parsedData.roomId?.toString();
      if (roomIdStr && !currentUser.rooms.includes(roomIdStr)) {
        currentUser.rooms.push(roomIdStr);
        
        const usersInRoom = users.filter(u => u.rooms.includes(roomIdStr)).map(u => ({ id: u.userId, name: u.name }));
        users.forEach(user => {
          if (user.rooms.includes(roomIdStr)) {
            user.ws.send(JSON.stringify({
              type: "active_users",
              users: usersInRoom,
              roomId: roomIdStr
            }));
          }
        });
      }
      return;
    }

    // LEAVE ROOM
    if (parsedData.type === "leave_room") {
      const roomIdStr = parsedData.roomId?.toString();
      currentUser.rooms = currentUser.rooms.filter(
        x => x !== roomIdStr
      );
      
      const usersInRoom = users.filter(u => u.rooms.includes(roomIdStr)).map(u => ({ id: u.userId, name: u.name }));
      users.forEach(user => {
        if (user.rooms.includes(roomIdStr)) {
          user.ws.send(JSON.stringify({
            type: "active_users",
            users: usersInRoom,
            roomId: roomIdStr
          }));
        }
      });
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
      const roomIdStr = parsedData.roomId?.toString();
      users.forEach(user => {
        if (user.rooms.includes(roomIdStr) && user.ws !== ws) {
          user.ws.send(JSON.stringify({
            type: "chat",
            message: parsedData.message,
            roomId: roomIdStr
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
