import { generateToken } from "../utils/jwtUtil";
import { encryptPassword, isCorrectPassword } from "../utils/passwordUtil";
import { isValidEmail, validatePasswordStrength } from "../utils/regexUtil";

export interface UserCredentials {
  emailAddress: string;
  password: string;
  jwtToken?: string;
}

export async function registerUser(
  fastify: any,
  request: any,
  reply: any
): Promise<any> {
  const { emailAddress, password }: UserCredentials =
    request.body as UserCredentials;

  const validatedPassword = validatePasswordStrength(password);

  if (!validatedPassword.isStrong) {
    return reply.status(400).send({
      error: "Weak password",
      message: validatedPassword.message,
    });
  }

  if (!isValidEmail(emailAddress)) {
    return reply.status(400).send({
      error: "Invalid email",
      message: "Email address is not valid",
    });
  }

  try {
    const existingUser = await findUserByEmail(fastify, emailAddress);

    if (existingUser.length) {
      return reply.status(400).send({
        error: "User already exists",
        message: `User email address ${emailAddress} already registered`,
      });
    }

    await addUser(fastify, emailAddress, password).then(() => {
      reply.status(200).send({ message: "User registration successful" });
    });
  } catch (error: any) {
    reply
      .status(400)
      .send({ error: "User registration failed", message: error.message });
  }
}

export async function loginUser(
  fastify: any,
  request: any,
  reply: any
): Promise<any> {
  const { emailAddress, password }: UserCredentials =
    request.body as UserCredentials;

  try {
    const existingUser = await findUserByEmail(fastify, emailAddress);

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

      await updateUserJwtToken(fastify, emailAddress, jwtToken).then(() => {
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
}

async function findUserByEmail(
  fastify: any,
  emailAddress: string
): Promise<any> {
  return await new Promise<any>((resolve, reject) => {
    fastify.mysql.query(
      `SELECT * FROM munch_pos.Users WHERE emailAddress = ?`,
      [emailAddress],
      (error: any, result: any[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}

async function addUser(
  fastify: any,
  emailAddress: string,
  password: string
): Promise<void> {
  return await new Promise<void>(async (resolve, reject) => {
    const hashedPassword: string = await encryptPassword(password);

    fastify.mysql.query(
      `INSERT INTO munch_pos.Users (emailAddress, password) VALUES (?, ?)`,
      [emailAddress, hashedPassword],
      (error: any) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
}

async function updateUserJwtToken(
  fastify: any,
  emailAddress: string,
  jwtToken: string
): Promise<any> {
  await new Promise<any>((resolve, reject) => {
    fastify.mysql.query(
      `UPDATE munch_pos.Users SET jwtToken = ? WHERE emailAddress = ?`,
      [jwtToken, emailAddress],
      (error: any, result: any[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
}
