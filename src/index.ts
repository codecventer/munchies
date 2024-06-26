import Fastify from "fastify";
import { RouteShorthandOptions } from "fastify";
import mysql from "@fastify/mysql";
import { MySQLPool } from "@fastify/mysql";
import * as dotenv from "dotenv";
import { authenticateJWT } from "./utils/jwtUtil";
import { registerUser, loginUser } from "./controllers/userController";

dotenv.config();

const fastify = Fastify({ logger: true });
const PORT: number = parseInt(process.env.PORT || "8080", 10);

declare module "fastify" {
  interface FastifyInstance {
    mysql: MySQLPool;
  }
}

const userRouteOptions: RouteShorthandOptions = {
  schema: {
    body: {
      type: "object",
      required: ["emailAddress", "password"],
      properties: {
        emailAddress: { type: "string" },
        password: { type: "string" },
      },
    },
  },
};

fastify.register(mysql, {
  connectionString: process.env.DB_CONNECTION_STRING,
});

fastify.post("/users/register", userRouteOptions, async (request, reply) => {
  await registerUser(fastify, request, reply);
});

fastify.post("/users/login", userRouteOptions, async (request, reply) => {
  await loginUser(fastify, request, reply);
});

//TODO: WIP
fastify.get(
  "/test-secure-endpoint",
  { preHandler: authenticateJWT },
  async (request, reply) => {}
);

const start = async () => {
  try {
    await fastify.listen({ port: PORT });
    fastify.log.info(`Server running on port: ${PORT}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
