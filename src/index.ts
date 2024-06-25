import Fastify from "fastify";
import mysql from "@fastify/mysql";
import * as dotenv from "dotenv";
dotenv.config();

const fastify = Fastify({ logger: true });
const PORT: number = parseInt(process.env.PORT || "8080", 10);

fastify.register(mysql, {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  promise: true,
});

fastify.get("/", async (request, reply) => {
  return JSON.stringify("Hello there! 👋");
});

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
