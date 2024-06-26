import Fastify from "fastify";
import mysql from "@fastify/mysql";
import { MySQLPool } from "@fastify/mysql";
import * as dotenv from "dotenv";
import { authenticateJWT } from "./utils/jwtUtil";
import { registerUser, loginUser } from "./controllers/userController";
import {
  addNewProduct,
  deleteProductByName,
  getAllActiveProducts,
  getAllProducts,
} from "./controllers/productController";
import { userRouteOptions } from "./utils/routeOptionsUtil";

dotenv.config();

const fastify = Fastify({ logger: true });
const PORT: number = parseInt(process.env.PORT || "8080", 10);

declare module "fastify" {
  interface FastifyInstance {
    mysql: MySQLPool;
  }
}

fastify.register(mysql, {
  connectionString: process.env.DB_CONNECTION_STRING,
});

//TODO: SECURE ENDPOINT
fastify.post("/users/register", userRouteOptions, async (request, reply) => {
  await registerUser(fastify, request, reply);
});

//TODO: SECURE ENDPOINT
fastify.post("/users/login", userRouteOptions, async (request, reply) => {
  await loginUser(fastify, request, reply);
});

fastify.get(
  "/products/all-products",
  { preHandler: authenticateJWT },
  async (request, reply) => {
    await getAllProducts(fastify, reply);
  }
);

fastify.get(
  "/products/all-active-products",
  { preHandler: authenticateJWT },
  async (request, reply) => {
    await getAllActiveProducts(fastify, reply);
  }
);

//TODO: USE PRODUCT ROUTE OPTION
fastify.post(
  "/products/add-product",
  { preHandler: authenticateJWT },
  async (request, reply) => {
    await addNewProduct(fastify, request, reply);
  }
);

//TODO: USE PRODUCT ROUTE OPTION
fastify.post(
  "/products/delete-product",
  { preHandler: authenticateJWT },
  async (request, reply) => {
    await deleteProductByName(fastify, request, reply);
  }
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
