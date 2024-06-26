import Fastify from "fastify";
import { RouteShorthandOptions } from "fastify";
import mysql from "@fastify/mysql";
import { MySQLPool } from "@fastify/mysql";
import * as dotenv from "dotenv";
import { encryptPassword, isCorrectPassword } from "./utils/passwordUtil";

dotenv.config();

const fastify = Fastify({ logger: true });
const PORT: number = parseInt(process.env.PORT || "8080", 10);

declare module "fastify" {
  interface FastifyInstance {
    mysql: MySQLPool;
  }
}

interface UserCredentials {
  emailAddress: string;
  password: string;
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

  try {
    const existingUser = await new Promise<any>((resolve, reject) => {
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

    if (existingUser.length > 0) {
      return reply.status(400).send({
        error: "User already exists",
        message: "User email address already registered",
      });
    }

    await new Promise<void>(async (resolve, reject) => {
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
    })
      .then(() => {
        reply.status(200).send({ message: "User registration successful" });
      })
      .catch((error: any) => {
        reply
          .status(400)
          .send({ error: "User registration failed", message: error.message });
      });
  } catch (error: any) {
    reply
      .status(400)
      .send({ error: "User registration failed", message: error.message });
  }
});

fastify.post("/users/login", userRouteOptions, async (request, reply) => {
  const { emailAddress, password }: UserCredentials =
    request.body as UserCredentials;

  try {
    const existingUser = await new Promise<any>((resolve, reject) => {
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

    const hashedPassword: string = existingUser[0].password;
    const isPasswordCorrect: boolean = await isCorrectPassword(
      password,
      hashedPassword
    );

    if (isPasswordCorrect) {
      reply.status(200).send({ message: "User login successful" });
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
