import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import { UserCredentials } from "../index";

const JWT_SECRET: string = process.env.JWT_SECRET || "default_secret";

export const generateToken = (user: UserCredentials): string => {
  return jwt.sign({ emailAddress: user.emailAddress }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

export const authenticateJWT = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const token = request.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      throw new Error("Authentication token missing");
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      throw new Error("Invalid token");
    }
  } catch (error: any) {
    reply.status(401).send({ error: "Unauthorized", message: error.message });
  }
};
