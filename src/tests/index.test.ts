import Fastify from "fastify";
import ajvCompiler from "@fastify/ajv-compiler";
import * as dotenv from "dotenv";
import { loginUser, registerUser } from "../controllers/userController";
import { userSchema } from "../utils/requestSchemaUtil";

dotenv.config();

jest.mock("../controllers/userController", () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
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

    await fastify.listen({ port: process.env.PORT });
  });

  afterAll(async () => {
    await fastify.close();
  });

  // Register user
  test("POST /users/register should call registerUser", async () => {
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
    expect(registerUser).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object)
    );
  });

  // Login user
  test("POST /users/login should call loginUser", async () => {
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
    expect(loginUser).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Object)
    );
  });
});

// run: npx jest