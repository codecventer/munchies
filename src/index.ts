import Fastify from "fastify";
import * as dotenv from "dotenv";
dotenv.config();

const fastify = Fastify({ logger: true });
const PORT: number = parseInt(process.env.PORT || "3000", 10);

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
