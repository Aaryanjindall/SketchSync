import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {
  CreateUserSchema,
  SigninSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async (req: Request, res: Response): Promise<void> => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.log(parsedData.error);
    res.status(400).json({
      message: "Incorrect inputs",
    });
    return;
  }

  try {
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data.username,
        // TODO: Hash the pw
        password: parsedData.data.password,
        name: parsedData.data.name,
      },
    });
    res.json({
      userId: user.id,
    });
    return;
  } catch (e) {
    console.error("SIGNUP ERROR", e);
    res.status(411).json({
      message: "User already exists with this username",
    });
    return;
  }
});

app.post("/signin", async (req: Request, res: Response): Promise<void> => {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({
      message: "Incorrect inputs",
    });
    return;
  }

  // TODO: Compare the hashed pws here
  const user = await prismaClient.user.findFirst({
    where: {
      email: parsedData.data.username,
      password: parsedData.data.password,
    },
  });

  if (!user) {
    res.status(403).json({
      message: "Not authorized",
    });
    return;
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET
  );

  res.json({
    token,
  });
  return;
});

app.get("/me", async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || typeof authHeader !== "string") {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  let token: string;
  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  } else {
    token = authHeader;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    if (!decoded || typeof decoded === "string" || !decoded.userId) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const user = await prismaClient.user.findUnique({
      where: { id: decoded.userId as string },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ user });
    return;
  } catch (e) {
    console.error("ME ERROR", e);
    res.status(403).json({ message: "Unauthorized" });
    return;
  }
});

app.post("/room", async (req: Request, res: Response): Promise<void> => {
  // Auth inside this handler to avoid any middleware issues
  const authHeader = req.headers["authorization"];
  if (!authHeader || typeof authHeader !== "string") {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  let token: string;
  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  } else {
    token = authHeader;
  }

  let userId: string;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    if (!decoded || typeof decoded === "string" || !decoded.userId) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }
    userId = decoded.userId;
  } catch (e) {
    console.error("ROOM AUTH ERROR", e);
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  const parsedData = CreateRoomSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.log(parsedData.error);
    res.status(400).json({
      message: "Incorrect inputs",
    });
    return;
  }

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    });

    res.json({
      roomId: room.id,
    });
    return;
  } catch (e: any) {
    console.error("ROOM CREATE ERROR", e);
    // Unique constraint or other Prisma errors
    res.status(500).json({
      message:
        e?.code === "P2002"
          ? "Room already exists with this name"
          : "Internal server error while creating room",
    });
    return;
  }
});

app.get(
  "/chats/:roomId",
  async (req: Request<{ roomId: string }>, res: Response): Promise<void> => {
  try {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "asc",
      },
      take: 1000,
    });

    res.json({
      messages,
    });
  } catch (e) {
    console.error("GET CHATS ERROR", e);
    res.json({
      messages: [],
    });
    return;
  }
  }
);

app.get(
  "/room/:slug",
  async (req: Request<{ slug: string }>, res: Response): Promise<void> => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
      where: {
        slug,
      },
    });

    res.json({
      room,
    });
    return;
  }
);

app.listen(3001);