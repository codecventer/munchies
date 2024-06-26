import Fastify from "fastify";
import { RouteShorthandOptions } from "fastify";
import mysql from "@fastify/mysql";
import { MySQLPool } from "@fastify/mysql";
import * as dotenv from "dotenv";
import { encryptPassword, isCorrectPassword } from "./utils/passwordUtil";
import { generateToken, authenticateJWT } from "./utils/jwtUtil";
import { isValidateEmail } from "./utils/regexUtil";

dotenv.config();

const fastify = Fastify({ logger: true });
const PORT: number = parseInt(process.env.PORT || "8080", 10);

declare module "fastify" {
  interface FastifyInstance {
    mysql: MySQLPool;
  }
}

export interface UserCredentials {
  emailAddress: string;
  password: string;
  jwtToken?: string;
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
  const { emailAddress, password }: UserCredentials =
    request.body as UserCredentials;

  if (!isValidateEmail(emailAddress)) {
    return reply.status(400).send({
      error: "Invalid email",
      message: "Email address is not valid",
    });
  }

  try {
    const existingUser = await findUser(emailAddress);

    if (existingUser.length) {
      return reply.status(400).send({
        error: "User already exists",
        message: "User email address already registered",
      });
    }

    await registerUser(emailAddress, password).then(() => {
      reply.status(200).send({ message: "User registration successful" });
    });
  } catch (error: any) {
    reply
      .status(400)
      .send({ error: "User registration failed", message: error.message });
  }
});

async function findUser(emailAddress: string): Promise<any> {
  return await new Promise<any>((resolve, reject) => {
    fastify.mysql.query(
      `SELECT * FROM munch_pos.Users WHERE emailAddress = ?`,
      [emailAddress],
      (error, result: any[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

async function registerUser(
  emailAddress: string,
  password: string
): Promise<void> {
  return await new Promise<void>(async (resolve, reject) => {
    const hashedPassword: string = await encryptPassword(password);

    fastify.mysql.query(
      `INSERT INTO munch_pos.Users (emailAddress, password) VALUES (?, ?);`,
      [emailAddress, hashedPassword],
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
}

fastify.post("/users/login", userRouteOptions, async (request, reply) => {
  const { emailAddress, password }: UserCredentials =
    request.body as UserCredentials;

  try {
    const existingUser = await findUser(emailAddress);

    if (!existingUser.length) {
      return reply.status(400).send({
        error: "User not found",
        message: `User with email ${emailAddress} does not exist`,
      });
    }

    const hashedPassword: string = existingUser[0].password;
    const isPasswordCorrect: boolean = await isCorrectPassword(
      password,
      hashedPassword
    );

    if (isPasswordCorrect) {
      const jwtToken: string = generateToken(existingUser[0]);

      await updateUserJwtToken(emailAddress, jwtToken).then(() => {
        reply
          .status(200)
          .send({ message: "User login successful", token: jwtToken });
      });
    } else {
      reply.status(400).send({
        error: "Invalid password",
        message: "Password is not correct",
      });
    }
  } catch (error: any) {
    reply
      .status(400)
      .send({ error: "User login failed", message: error.message });
  }
});

async function updateUserJwtToken(emailAddress: string, jwtToken: string) {
  await new Promise<any>((resolve, reject) => {
    fastify.mysql.query(
      `UPDATE munch_pos.Users SET jwtToken = ? WHERE emailAddress = ?`,
      [jwtToken, emailAddress],
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

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
