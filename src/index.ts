import Fastify from "fastify";
import * as dotenv from "dotenv";
import { authenticateJWT } from "./utils/jwtUtil";
import { registerUser, loginUser } from "./controllers/userController";
import {
  addNewProduct,
  deleteProductByName,
  getAllActiveProducts,
  getAllProducts,
  linkUpsellProductByIds,
  updateProductByField as updateProductByField,
} from "./controllers/productController";

dotenv.config();

const fastify = Fastify({ logger: true });
const PORT: number = parseInt(process.env.PORT || "8080", 10);

fastify.post(
  "/users/register",
  // { preHandler: authenticateJWT }, //TODO: REFACTOR
  async (request, reply) => {
    await registerUser(request, reply);
  }
);

fastify.post(
  "/users/login",
  // { preHandler: authenticateJWT }, //TODO: REFACTOR
  async (request, reply) => {
    await loginUser(request, reply);
  }
);

fastify.get(
  "/products/all-products",
  { preHandler: authenticateJWT },
  async (request, reply) => {
    await getAllProducts(reply);
  }
);

fastify.get(
  "/products/all-active-products",
  { preHandler: authenticateJWT },
  async (request, reply) => {
    await getAllActiveProducts(reply);
  }
);

fastify.post(
  "/products/add-product",
  { preHandler: authenticateJWT },
  async (request, reply) => {
    await addNewProduct(request, reply);
  }
);

fastify.post(
  "/products/delete-product",
  { preHandler: authenticateJWT },
  async (request, reply) => {
    await deleteProductByName(request, reply);
  }
);

fastify.post(
  "/products/update-product",
  { preHandler: authenticateJWT },
  async (request, reply) => {
    await updateProductByField(request, reply);
  }
);

fastify.post(
  "/products/link-upsell-product",
  { preHandler: authenticateJWT },
  async (request, reply) => {
    await linkUpsellProductByIds(request, reply);
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
