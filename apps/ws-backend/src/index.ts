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

function broadcastActiveUsers(roomIdStr: string) {
  const usersInRoom = users.filter(u => u.rooms.includes(roomIdStr)).map(u => ({ id: u.userId, name: u.name }));
  users.forEach(user => {
    if (user.rooms.includes(roomIdStr) && user.ws.readyState === WebSocket.OPEN) {
      user.ws.send(JSON.stringify({
        type: "active_users",
        users: usersInRoom,
        roomId: roomIdStr
      }));
    }
  });
}

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    return decoded?.userId || null;
  } catch {
    return null;
  }
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
  users.push({
    userId,
    name: "Anonymous",
    rooms: [],
    ws
  });

  // Fetch name asynchronously so we don't block incoming socket messages like join_room
  prismaClient.user.findUnique({ where: { id: userId } }).then(dbUser => {
    if (!dbUser) {
      ws.close();
      return;
    }
    const u = users.find(x => x.ws === ws);
    if (u) {
      u.name = dbUser.name || "Anonymous";
      u.rooms.forEach(roomIdStr => broadcastActiveUsers(roomIdStr));
    }
  }).catch(err => {
    console.error("Failed to fetch user", err);
    ws.close();
  });

  ws.on('close', () => {
    const index = users.findIndex(user => user.ws === ws);
    if (index !== -1) {
      const leavingUser = users[index];
      users.splice(index, 1);
      
      if (leavingUser && leavingUser.rooms) {
        leavingUser.rooms.forEach(roomIdStr => {
          broadcastActiveUsers(roomIdStr);
        });
      }
    }
  });

  ws.on('message', async function message(data) {
  try {
    const parsedData = JSON.parse(data.toString());

    console.log("message received");
    console.log(parsedData);

    const currentUser = users.find(x => x.ws === ws);
    if (!currentUser) return;

    // JOIN ROOM
    if (parsedData.type === "join_room") {
      const roomIdStr = parsedData.roomId?.toString();
      if (roomIdStr && !currentUser.rooms.includes(roomIdStr)) {
        currentUser.rooms.push(roomIdStr);
        broadcastActiveUsers(roomIdStr);
      }
      return;
    }

    // LEAVE ROOM
    if (parsedData.type === "leave_room") {
      const roomIdStr = parsedData.roomId?.toString();
      currentUser.rooms = currentUser.rooms.filter(
        x => x !== roomIdStr
      );
      if (roomIdStr) {
        broadcastActiveUsers(roomIdStr);
      }
      return;
    }

    // CHAT MESSAGE
    if (parsedData.type === "chat") {

      const roomId = Number(parsedData.roomId);
      const roomIdStr = parsedData.roomId?.toString();

      // Broadcast instantly before talking to the database
      users.forEach(user => {
        if (user.rooms.includes(roomIdStr) && user.ws !== ws && user.ws.readyState === WebSocket.OPEN) {
          user.ws.send(JSON.stringify({
            type: "chat",
            message: parsedData.message,
            roomId: roomIdStr
          }));
        }
      });

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

      return;
    }

    // CLEAR BOARD (admin only)
    if (parsedData.type === "clear") {
      const roomId = Number(parsedData.roomId);

      // Broadcast clear event to all users in this room instantly so it feels perfectly smooth
      users.forEach(user => {
        if (user.rooms.includes(String(roomId)) && user.ws.readyState === WebSocket.OPEN) {
          user.ws.send(JSON.stringify({
            type: "clear",
            roomId: String(roomId)
          }));
        }
      });

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
