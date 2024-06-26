export interface ProductInformation {
  name: string;
  price: number;
  description: string;
  quantity: number;
}

export async function getAllProducts(fastify: any, reply: any): Promise<any> {
  return await new Promise<any>((resolve, reject) => {
    fastify.mysql.query(
      `SELECT * FROM munch_pos.Products`,
      (error: any, result: any[]) => {
        if (error) {
          reject(error);
          reply.status(400).send({
            error: "Failed to get all products",
            message: error.message,
          });
        } else {
          resolve(result);
          reply.status(200).send(result);
        }
      }
    );
  });
}

export async function getAllActiveProducts(
  fastify: any,
  reply: any
): Promise<any> {
  return await new Promise<any>((resolve, reject) => {
    fastify.mysql.query(
      `SELECT * FROM munch_pos.Products WHERE deleted = false`,
      (error: any, result: any[]) => {
        if (error) {
          reject(error);
          reply.status(400).send({
            error: "Failed to get all products",
            message: error.message,
          });
        } else {
          resolve(result);
          reply.status(200).send(result);
        }
      }
    );
  });
}

export async function addNewProduct(
  fastify: any,
  request: any,
  reply: any
): Promise<any> {
  const { name, price, description, quantity }: ProductInformation =
    request.body as ProductInformation;

  const fieldValidationErrors: string | null = validateAddProductFields(
    name,
    price,
    description,
    quantity
  );

  if (fieldValidationErrors) {
    return reply.status(400).send({ error: fieldValidationErrors });
  }

  try {
    const existingProduct = await findProductByName(fastify, name);

    if (existingProduct.length) {
      return reply.status(400).send({
        error: "Product already exists",
        message: `Product with name ${name} already exists`,
      });
    }

    await addProduct(fastify, name, price, description, quantity).then(() => {
      reply.status(200).send({ message: "Successfully added new product" });
    });
  } catch (error: any) {
    reply
      .status(400)
      .send({ error: "Failed to add product", message: error.message });
  }
}

export async function deleteProductByName(
  fastify: any,
  request: any,
  reply: any
): Promise<any> {
  const productName = request.body.name;

  try {
    await deleteProduct(fastify, productName).then(() => {
      reply.status(200).send({ message: "Successfully deleted product" });
    });
  } catch (error: any) {
    reply
      .status(400)
      .send({ error: "Failed to delete product", message: error.message });
  }
}

async function findProductByName(
  fastify: any,
  productName: string
): Promise<any> {
  return await new Promise<any>((resolve, reject) => {
    fastify.mysql.query(
      `SELECT * FROM munch_pos.Products WHERE name = ?`,
      [productName],
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

async function addProduct(
  fastify: any,
  name: string,
  price: number,
  description: string,
  quantity: number
): Promise<void> {
  return await new Promise<void>(async (resolve, reject) => {
    fastify.mysql.query(
      `INSERT INTO munch_pos.Products (name, description, price, quantity, deleted) VALUES (?, ?, ?, ?, false)`,
      [name, description, price, quantity],
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

async function deleteProduct(fastify: any, name: string): Promise<void> {
  return await new Promise<void>(async (resolve, reject) => {
    fastify.mysql.query(
      `UPDATE munch_pos.Products SET deleted = true WHERE name = ?`,
      [name],
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

function validateAddProductFields(
  name: string,
  price: number,
  description: string,
  quantity: number
): string | null {
  if (!name || !price || !description || !quantity) {
    return "Required fields: name, price, description, quantity";
  }

  const errors: string[] = [];

  if (typeof name !== "string") {
    errors.push("Invalid data type for 'name', expected string.");
  }
  if (typeof description !== "string") {
    errors.push("Invalid data type for 'description', expected string.");
  }
  if (typeof price !== "number") {
    errors.push("Invalid data type for 'price', expected number.");
  }
  if (typeof quantity !== "number") {
    errors.push("Invalid data type for 'quantity', expected number.");
  }

  if (errors.length > 0) {
    return errors.join(" ");
  }

  return null;
}
