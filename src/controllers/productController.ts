import { Exception } from "../utils/exceptionUtil";
import { validateStringNotNullOrBlank } from "../utils/stringUtil";

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
            error: "Failed to get all active products",
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
        error: "Failed to add product",
        message: `Product with name '${name}' already exists`,
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
  const productName: string = request.body.name;

  if (!validateStringNotNullOrBlank(productName)) {
    return reply.status(400).send({
      error: "Failed to delete product",
      message: "Product name required",
    });
  }

  const existingProduct = await findProductByName(fastify, productName);

  if (!existingProduct.length) {
    return reply.status(400).send({
      error: "Failed to delete product",
      message: `Could not find product with name '${productName}'`,
    });
  }

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

export async function updateProductByField(
  fastify: any,
  request: any,
  reply: any
): Promise<any> {
  const name: string = request.body.name;
  const index: number = request.body.index;
  const value: string = request.body.value;

  const existingProduct = await findProductByName(fastify, name);

  if (!existingProduct.length) {
    return reply.status(400).send({
      error: "Failed to delete product",
      message: `Could not find product with name '${name}'`,
    });
  }

  if (index < 0 || index > 3) {
    return reply.status(400).send({
      error: "Failed to update product",
      message: `Could not find field for index '${index}'`,
    });
  }

  if (!validateIndexValueType(index, value)) {
    return reply.status(400).send({
      error: "Failed to update product",
      message: `Value of '${value}' is incorrect data type for index '${index}'`,
    });
  }

  if (index == 0 || index == 1) {
    if (!validateStringNotNullOrBlank(value)) {
      return reply.status(400).send({
        error: "Failed to update product",
        message: "Update value required",
      });
    }
  }

  try {
    await updateProduct(fastify, name, index, value).then(() => {
      reply.status(200).send({ message: "Successfully updated product" });
    });
  } catch (error: any) {
    reply
      .status(400)
      .send({ error: "Failed to update product", message: error.message });
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

async function updateProduct(
  fastify: any,
  name: string,
  index: number,
  value: string
): Promise<void> {
  const field: string | null = getColumnNameByIndex(index);

  if (field == null) {
    throw new Exception("Field value cannot be null to update product");
  }

  return await new Promise<void>(async (resolve, reject) => {
    fastify.mysql.query(
      `UPDATE munch_pos.Products SET \`${field}\` = ? WHERE name = ?`,
      [value, name],
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

function validateIndexValueType(index: number, value: any): boolean {
  if (index === 0 || index === 1) {
    return typeof value === "string";
  }

  if (index === 2 || index === 3) {
    return typeof value === "number";
  }

  return false;
}

function getColumnNameByIndex(index: number): string | null {
  return index === 0
    ? "name"
    : index === 1
    ? "description"
    : index === 2
    ? "price"
    : index === 3
    ? "quantity"
    : null;
}
