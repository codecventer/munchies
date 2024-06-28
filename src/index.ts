import Fastify from "fastify";
import ajvCompiler from "@fastify/ajv-compiler";
import * as dotenv from "dotenv";
import { authenticateJWT } from "./utils/jwtUtil";
import { registerUser, loginUser } from "./controllers/userController";
import {
  addNewProduct,
  deleteProductByName,
  getAllActiveProducts,
  getAllProducts,
  getProductUpsellProducts,
  linkUpsellProductByIds,
  unlinkProductUpsellProduct,
  updateProductByField as updateProductByField,
} from "./controllers/productController";
import {
  addNewTransaction,
  getTransactionById,
} from "./controllers/transactionController";
import {
  addProductSchema,
  deleteProductSchema,
  linkUpsellProductSchema,
  productUpsellProductsSchema,
  addTransactionSchema,
  unlinkUpsellProductSchema,
  updateProductSchema,
  userSchema,
  getTransactionSchema,
} from "./utils/requestSchemaUtil";

dotenv.config();

const PORT: number = parseInt(process.env.PORT!);

const fastify = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      strict: false,
      allowUnionTypes: true,
    },
  },
  schemaController: {
    compilersFactory: {
      buildValidator: ajvCompiler(),
    },
  },
});

fastify.post(
  "/users/register",
  { schema: userSchema }, //TODO: JWT AUTHENTICATION
  async (request, reply) => {
    await registerUser(request, reply);
  }
);

fastify.post(
  "/users/login",
  { schema: userSchema }, //TODO: JWT AUTHENTICATION
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
  { preHandler: authenticateJWT, schema: addProductSchema },
  async (request, reply) => {
    await addNewProduct(request, reply);
  }
);

fastify.post(
  "/products/delete-product",
  { preHandler: authenticateJWT, schema: deleteProductSchema },
  async (request, reply) => {
    await deleteProductByName(request, reply);
  }
);

fastify.post(
  "/products/update-product",
  { preHandler: authenticateJWT, schema: updateProductSchema },
  async (request, reply) => {
    await updateProductByField(request, reply);
  }
);

fastify.post(
  "/products/link-upsell-product",
  { preHandler: authenticateJWT, schema: linkUpsellProductSchema },
  async (request, reply) => {
    await linkUpsellProductByIds(request, reply);
  }
);

fastify.post(
  "/products/product-upsell-products",
  { preHandler: authenticateJWT, schema: productUpsellProductsSchema },
  async (request, reply) => {
    await getProductUpsellProducts(request, reply);
  }
);

fastify.post(
  "/products/unlink-upsell-product",
  { preHandler: authenticateJWT, schema: unlinkUpsellProductSchema },
  async (request, reply) => {
    await unlinkProductUpsellProduct(request, reply);
  }
);

fastify.post(
  "/transactions/add-transaction",
  { preHandler: authenticateJWT, schema: addTransactionSchema },
  async (request, reply) => {
    await addNewTransaction(request, reply);
  }
);

fastify.post(
  "/transactions/get-transaction",
  { preHandler: authenticateJWT, schema: getTransactionSchema },
  async (request, reply) => {
    await getTransactionById(request, reply);
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
