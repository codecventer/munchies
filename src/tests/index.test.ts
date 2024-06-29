import Fastify from "fastify";
import ajvCompiler from "@fastify/ajv-compiler";
import * as dotenv from "dotenv";
import { loginUser, registerUser } from "../controllers/userController";
import {
  getAllProducts,
  getAllActiveProducts,
  addNewProduct,
  deleteProductByName,
  updateProductByField,
  linkUpsellProductByIds,
  getProductUpsellProducts,
  unlinkProductUpsellProduct,
} from "../controllers/productController";
import {
  addNewTransaction,
  getTransactionById,
} from "../controllers/transactionController";
import {
  addProductSchema,
  addTransactionSchema,
  deleteProductSchema,
  getTransactionSchema,
  linkUpsellProductSchema,
  productUpsellProductsSchema,
  unlinkUpsellProductSchema,
  updateProductSchema,
  userSchema,
} from "../utils/requestSchemaUtil";
import { authenticateJWT } from "../utils/jwtUtil";

dotenv.config();

jest.mock("../controllers/userController", () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
}));

jest.mock("../controllers/productController", () => ({
  getAllProducts: jest.fn(),
  getAllActiveProducts: jest.fn(),
  addNewProduct: jest.fn(),
  deleteProductByName: jest.fn(),
  updateProductByField: jest.fn(),
  linkUpsellProductByIds: jest.fn(),
  getProductUpsellProducts: jest.fn(),
  unlinkProductUpsellProduct: jest.fn(),
}));

jest.mock("../controllers/transactionController", () => ({
  addNewTransaction: jest.fn(),
  getTransactionById: jest.fn(),
}));

jest.mock("../utils/jwtUtil", () => ({
  authenticateJWT: jest.fn((req, rep, done) => {
    done();
  }),
}));

describe("Fastify server", () => {
  let fastify: any;

  beforeAll(async () => {
    fastify = Fastify({
      logger: false,
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
      async (request: any, reply: any) => {
        await registerUser(request, reply);
      }
    );

    fastify.post(
      "/users/login",
      { schema: userSchema }, //TODO: JWT AUTHENTICATION
      async (request: any, reply: any) => {
        await loginUser(request, reply);
      }
    );

    fastify.get(
      "/products/all-products",
      { preHandler: authenticateJWT },
      async (request: any, reply: any) => {
        await getAllProducts(reply);
      }
    );

    fastify.get(
      "/products/all-active-products",
      { preHandler: authenticateJWT },
      async (request: any, reply: any) => {
        await getAllActiveProducts(reply);
      }
    );

    fastify.post(
      "/products/add-product",
      { preHandler: authenticateJWT, schema: addProductSchema },
      async (request: any, reply: any) => {
        await addNewProduct(request, reply);
      }
    );

    fastify.post(
      "/products/delete-product",
      { preHandler: authenticateJWT, schema: deleteProductSchema },
      async (request: any, reply: any) => {
        await deleteProductByName(request, reply);
      }
    );

    fastify.post(
      "/products/update-product",
      { preHandler: authenticateJWT, schema: updateProductSchema },
      async (request: any, reply: any) => {
        await updateProductByField(request, reply);
      }
    );

    fastify.post(
      "/products/link-upsell-product",
      { preHandler: authenticateJWT, schema: linkUpsellProductSchema },
      async (request: any, reply: any) => {
        await linkUpsellProductByIds(request, reply);
      }
    );

    fastify.post(
      "/products/product-upsell-products",
      { preHandler: authenticateJWT, schema: productUpsellProductsSchema },
      async (request: any, reply: any) => {
        await getProductUpsellProducts(request, reply);
      }
    );

    fastify.post(
      "/products/unlink-upsell-product",
      { preHandler: authenticateJWT, schema: unlinkUpsellProductSchema },
      async (request: any, reply: any) => {
        await unlinkProductUpsellProduct(request, reply);
      }
    );

    fastify.post(
      "/transactions/add-transaction",
      { preHandler: authenticateJWT, schema: addTransactionSchema },
      async (request: any, reply: any) => {
        await addNewTransaction(request, reply);
      }
    );

    fastify.post(
      "/transactions/get-transaction",
      { preHandler: authenticateJWT, schema: getTransactionSchema },
      async (request: any, reply: any) => {
        await getTransactionById(request, reply);
      }
    );

    await fastify.listen({ port: process.env.PORT });
  });

  afterAll(async () => {
    await fastify.close();
  });

  // Register user
  test("POST /users/register should return status code 200 for valid requests", async () => {
    const requestPayload = {
      emailAddress: "test@gmail.com",
      password: "Qwerty!1",
    };

    (registerUser as jest.Mock).mockImplementation(async (req, rep) => {
      rep.status(200).send({ message: "User registration successful" });
    });

    const response = await fastify.inject({
      method: "POST",
      url: "/users/register",
      payload: requestPayload,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      message: "User registration successful",
    });
  });

  // Login user
  test("POST /users/login should return status code 200 for valid requests", async () => {
    const requestPayload = {
      emailAddress: "test@gmail.com",
      password: "Qwerty!1",
    };

    (loginUser as jest.Mock).mockImplementation(async (req, rep) => {
      rep.status(200).send({
        message: "User login successful",
        token: "some_token_example",
      });
    });

    const response = await fastify.inject({
      method: "POST",
      url: "/users/login",
      payload: requestPayload,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      message: "User login successful",
      token: "some_token_example",
    });
  });

  // Get all products
  test("GET /products/all-products should return status code 200 for valid requests", async () => {
    (getAllProducts as jest.Mock).mockImplementation(async (rep) => {
      rep.status(200);
    });

    const response = await fastify.inject({
      method: "GET",
      url: "/products/all-products",
    });

    expect(response.statusCode).toBe(200);
  });

  // Get all active products
  test("GET /products/all-active-products should return status code 200 for valid requests", async () => {
    (getAllActiveProducts as jest.Mock).mockImplementation(async (rep) => {
      rep.status(200);
    });

    const response = await fastify.inject({
      method: "GET",
      url: "/products/all-active-products",
    });

    expect(response.statusCode).toBe(200);
  });

  // Add product
  test("POST /products/add-product should return status code 200 for valid requests", async () => {
    const mockProduct = {
      name: "New Product",
      price: 100,
      description: "This is a new product",
      quantity: 10,
    };

    (addNewProduct as jest.Mock).mockImplementation(async (req, rep) => {
      rep.status(200).send({ message: "Successfully added new product" });
    });

    const response = await fastify.inject({
      method: "POST",
      url: "/products/add-product",
      headers: {
        Authorization: "Bearer mockJWTToken",
      },
      payload: mockProduct,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      message: "Successfully added new product",
    });
  });

  // Delete product
  test("POST /products/delete-product should return status code 200 for valid requests", async () => {
    const mockProduct = {
      name: "Product to Delete",
    };

    (deleteProductByName as jest.Mock).mockImplementation(async (req, rep) => {
      rep.status(200).send({ message: "Successfully deleted product" });
    });

    const response = await fastify.inject({
      method: "POST",
      url: "/products/delete-product",
      headers: {
        Authorization: "Bearer mockJWTToken",
      },
      payload: mockProduct,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      message: "Successfully deleted product",
    });
  });

  // Update product
  test("POST /products/update-product should return status code 200 for valid requests", async () => {
    const validMockUpdatePayloads = [
      { name: "Product1", index: 0, value: "Updated Name" },
      { name: "Product1", index: 1, value: "Updated Description" },
      { name: "Product1", index: 2, value: 150 },
      { name: "Product1", index: 3, value: 20 },
    ];

    (updateProductByField as jest.Mock).mockImplementation(async (req, rep) => {
      rep.status(200).send({ message: "Successfully updated product" });
    });

    for (const payload of validMockUpdatePayloads) {
      const response = await fastify.inject({
        method: "POST",
        url: "/products/update-product",
        headers: {
          Authorization: "Bearer mockJWTToken",
        },
        payload,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        message: "Successfully updated product",
      });
    }
  });

  // Update product - negative test case
  test("POST /products/update-product should return status code 400 for invalid requests", async () => {
    const invalidMockUpdatePayloads = [
      { name: "Product 1", index: 4, value: "Invalid index" },
      { name: "Product 1", index: 0, value: 123 },
      { name: "Product 1", index: 2, value: "Not a number" },
      { name: "Non Existent Product", index: 1, value: "New description" },
    ];

    (updateProductByField as jest.Mock).mockImplementation(async (req, rep) => {
      rep.status(400).send({ message: "Failed to update product" });
    });

    for (const payload of invalidMockUpdatePayloads) {
      const response = await fastify.inject({
        method: "POST",
        url: "/products/update-product",
        headers: {
          Authorization: "Bearer mockJWTToken",
        },
        payload,
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({
        message: "Failed to update product",
      });
    }
  });

  // Link upsell product
  test("POST /products/link-upsell-product should return status code 200 for valid requests", async () => {
    const validMockPayload = {
      product_id: 1,
      upsell_product_id: 2,
    };

    (linkUpsellProductByIds as jest.Mock).mockImplementation(
      async (req, rep) => {
        rep.status(200).send({ message: "Successfully linked upsell product" });
      }
    );

    const response = await fastify.inject({
      method: "POST",
      url: "/products/link-upsell-product",
      headers: {
        Authorization: "Bearer mockJWTToken",
      },
      payload: validMockPayload,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      message: "Successfully linked upsell product",
    });
  });

  // Product upsell products
  test("POST /products/product-upsell-products should return status code 200 for valid requests", async () => {
    const validMockPayload = {
      product_id: 1,
    };

    (getProductUpsellProducts as jest.Mock).mockImplementation(
      async (req, rep) => {
        rep.status(200);
      }
    );

    const response = await fastify.inject({
      method: "POST",
      url: "/products/product-upsell-products",
      headers: {
        Authorization: "Bearer mockJWTToken",
      },
      payload: validMockPayload,
    });

    expect(response.statusCode).toBe(200);
  });

  // Unlink upsell product
  test("POST /products/unlink-upsell-product should return status code 200 for valid requests", async () => {
    const validMockPayload = {
      product_id: 1,
    };

    (unlinkProductUpsellProduct as jest.Mock).mockImplementation(
      async (req, rep) => {
        rep
          .status(200)
          .send({ message: "Successfully unlinked upsell product" });
      }
    );

    const response = await fastify.inject({
      method: "POST",
      url: "/products/unlink-upsell-product",
      headers: {
        Authorization: "Bearer mockJWTToken",
      },
      payload: validMockPayload,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      message: "Successfully unlinked upsell product",
    });
  });

  // Add transaction
  test("POST /transactions/add-transaction should return status code 200 for valid requests", async () => {
    const validMockPayload = {
      product_id: 1,
      quantity: 2,
      total: 50.0,
    };

    (addNewTransaction as jest.Mock).mockImplementation(async (req, rep) => {
      rep.status(200).send({ message: "Successfully added transaction" });
    });

    const response = await fastify.inject({
      method: "POST",
      url: "/transactions/add-transaction",
      headers: {
        Authorization: "Bearer mockJWTToken",
      },
      payload: validMockPayload,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      message: "Successfully added transaction",
    });
  });

  // Get transaction
  test("POST /transactions/get-transaction should return status code 200 for valid requests", async () => {
    const validMockPayload = {
      transaction_id: 1,
    };

    (getTransactionById as jest.Mock).mockImplementation(async (req, rep) => {
      rep.status(200);
    });

    const response = await fastify.inject({
      method: "POST",
      url: "/transactions/get-transaction",
      headers: {
        Authorization: "Bearer mockJWTToken",
      },
      payload: validMockPayload,
    });

    expect(response.statusCode).toBe(200);
  });
});
