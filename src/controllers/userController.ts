import user from "../models/user";
import { generateToken } from "../utils/jwtUtil";
import { encryptPassword, isCorrectPassword } from "../utils/passwordUtil";
import { isValidEmail, validatePasswordStrength } from "../utils/regexUtil";

export interface UserCredentials {
  emailAddress: string;
  password: string;
  jwtToken?: string;
}

export async function registerUser(request: any, reply: any): Promise<any> {
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
    const existingUser = await findUserByEmail(emailAddress);

    if (existingUser != null) {
      return reply.status(400).send({
        error: "User already exists",
        message: `User email address '${emailAddress}' already registered`,
      });
    }

    await addUser(emailAddress, password).then(() => {
      reply.status(200).send({ message: "User registration successful" });
    });
  } catch (error: any) {
    reply
      .status(400)
      .send({ error: "User registration failed", message: error.message });
  }
}

export async function loginUser(request: any, reply: any): Promise<any> {
  const { emailAddress, password }: UserCredentials =
    request.body as UserCredentials;

  try {
    const existingUser = await findUserByEmail(emailAddress);

    if (existingUser == null) {
      return reply.status(400).send({
        error: "User not found",
        message: `User with email '${emailAddress}' does not exist`,
      });
    }

    const hashedPassword: string = existingUser.dataValues.password;
    const isPasswordCorrect: boolean = await isCorrectPassword(
      password,
      hashedPassword
    );

    if (isPasswordCorrect) {
      const userCredentials: UserCredentials = {
        emailAddress: emailAddress,
        password: password,
      };
      const jwtToken: string = generateToken(userCredentials);

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
}

async function findUserByEmail(emailAddress: string): Promise<user | null> {
  try {
    const existingUser = await user.findOne({
      where: {
        emailAddress: emailAddress,
      },
    });
    return existingUser;
  } catch (error: any) {
    throw new Error(`Error finding user by email: ${error.message}`);
  }
}

async function addUser(emailAddress: string, password: string): Promise<void> {
  try {
    const hashedPassword: string = await encryptPassword(password);

    await user.create({
      emailAddress: emailAddress,
      password: hashedPassword,
    });

    return;
  } catch (error: any) {
    throw new Error(`Error adding user: ${error.message}`);
  }
}

async function updateUserJwtToken(
  emailAddress: string,
  jwtToken: string
): Promise<void> {
  try {
    await user.update(
      { jwtToken: jwtToken },
      { where: { emailAddress: emailAddress } }
    );

    return;
  } catch (error: any) {
    throw new Error(`Error updating jwtToken: ${error.message}`);
  }
}
