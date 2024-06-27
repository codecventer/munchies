import bcrypt from "bcrypt";

export async function encryptPassword(
  plaintextPassword: string
): Promise<string> {
  const saltRounds: number = 10;

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(plaintextPassword, salt);

    return hash;
  } catch (error) {
    throw error;
  }
}

export async function isCorrectPassword(
  plaintextPassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const isMatch: boolean = await bcrypt.compare(
      plaintextPassword,
      hashedPassword
    );
    return isMatch;
  } catch (error) {
    throw error;
  }
}
