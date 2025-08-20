import bcrypt from "bcrypt";

export async function encryptPassword(
  plaintextPassword: string
): Promise<string> {
  const saltRounds: number = 10;

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(plaintextPassword, salt);
  } catch (error) {
    throw error;
  }
}

export async function isCorrectPassword(
  plaintextPassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(plaintextPassword, hashedPassword);
  } catch (error) {
    throw error;
  }
}
