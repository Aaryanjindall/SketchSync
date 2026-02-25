import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function middleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || typeof authHeader !== "string") {
    return res.status(403).json({
      message: "Unauthorized",
    });
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
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    // @ts-ignore: augmented request type
    req.userId = decoded.userId;
    next();
  } catch (e) {
    return res.status(403).json({
      message: "Unauthorized",
    });
  }
}