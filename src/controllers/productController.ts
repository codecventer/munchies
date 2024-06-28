import { validateStringNotNullOrBlank } from "../utils/stringUtil";
import product from "../models/product";

export interface ProductInformation {
  name: string;
  price: number;
  description: string;
  quantity: number;
}

export async function getAllProducts(reply: any): Promise<any> {
  try {
    const allProducts = await product.findAll();

    if (allProducts == null || allProducts.length === 0) {
      reply.status(200).send({ message: "No products found" });
    }

    reply.status(200).send(allProducts);
  } catch (error: any) {
    reply
      .status(400)
      .send({ error: "Failed to get all products", message: error.message });
    throw new Error(`Failed to get all products: ${error.message}`);
  }
}

export async function getAllActiveProducts(reply: any): Promise<any> {
  try {
    const activeProducts = await product.findAll({
      where: {
        deleted: false,
      },
    });

    if (activeProducts == null || activeProducts.length === 0) {
      reply.status(200).send({ message: "No active products found" });
    }

    reply.status(200).send(activeProducts);
  } catch (error: any) {
    reply.status(400).send({
      error: "Failed to get all active products",
      message: error.message,
    });
    throw new Error(`Failed to get all active products: ${error.message}`);
  }
}

export async function addNewProduct(request: any, reply: any): Promise<any> {
  const { name, price, description, quantity }: ProductInformation =
    request.body as ProductInformation;

  try {
    const existingProduct = await findProductByName(name);

    if (existingProduct != null) {
      return reply.status(400).send({
        error: "Failed to add product",
        message: `Product with name '${name}' already exists`,
      });
    }

    await addProduct(name, price, description, quantity).then(() => {
      reply.status(200).send({ message: "Successfully added new product" });
    });
  } catch (error: any) {
    reply
      .status(400)
      .send({ error: "Failed to add product", message: error.message });
  }
}

export async function deleteProductByName(
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

  const existingProduct = await findProductByName(productName);

  if (existingProduct == null) {
    return reply.status(400).send({
      error: "Failed to delete product",
      message: `Could not find product with name '${productName}'`,
    });
  }

  try {
    await deleteProduct(productName).then(() => {
      reply.status(200).send({ message: "Successfully deleted product" });
    });
  } catch (error: any) {
    reply
      .status(400)
      .send({ error: "Failed to delete product", message: error.message });
  }
}

export async function updateProductByField(
  request: any,
  reply: any
): Promise<any> {
  const name: string = request.body.name;
  const index: number = request.body.index;
  const value: string = request.body.value;

  const existingProduct = await findProductByName(name);

  if (existingProduct == null) {
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

  if (!isValidIndexValueType(index, value)) {
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
    await updateProduct(name, index, value).then(() => {
      reply.status(200).send({ message: "Successfully updated product" });
    });
  } catch (error: any) {
    reply
      .status(400)
      .send({ error: "Failed to update product", message: error.message });
  }
}

export async function linkUpsellProductByIds(
  request: any,
  reply: any
): Promise<any> {
  const productId: number = request.body.product_id;
  const upsellProductId: number = request.body.upsell_product_id;

  if (productId == upsellProductId) {
    return reply.status(400).send({
      error: "Failed to link upsell product",
      message: "Cannot link product with itself",
    });
  }

  const baseProduct = await findProductById(productId);
  const upsellProduct = await findProductById(upsellProductId);

  if (baseProduct == null) {
    return reply.status(400).send({
      error: "Failed to link upsell product",
      message: `Product with id '${productId}' not found`,
    });
  } else if (upsellProduct == null) {
    return reply.status(400).send({
      error: "Failed to link upsell product",
      message: `Product with id '${upsellProductId}' not found`,
    });
  }

  try {
    await linkUpsellProduct(productId, upsellProductId).then(() => {
      reply.status(200).send({ message: "Successfully linked upsell product" });
    });
  } catch (error: any) {
    reply
      .status(400)
      .send({ error: "Failed to link upsell product", message: error.message });
  }
}

export async function getProductUpsellProducts(
  request: any,
  reply: any
): Promise<any> {
  const productId: number = request.body.product_id;
  const existingProduct = await findProductById(productId);

  if (existingProduct == null) {
    return reply.status(400).send({
      error: "Failed to get upsell products",
      message: `Product with id '${productId}' not found`,
    });
  }

  try {
    const upsellProducts = await getUpsellProducts(productId);

    if (upsellProducts == null || upsellProducts.length === 0) {
      reply.status(200).send({ message: "No upsell product(s) found" });
    }

    reply.status(200).send(upsellProducts);
  } catch (error: any) {
    reply
      .status(400)
      .send({ error: "Failed to get upsell products", message: error.message });
  }
}

export async function unlinkProductUpsellProduct(
  request: any,
  reply: any
): Promise<any> {
  const productId: number = request.body.product_id;
  const existingProduct = await findProductById(productId);

  if (existingProduct == null) {
    return reply.status(400).send({
      error: "Failed to unlink upsell product",
      message: `Product with id '${productId}' not found`,
    });
  }

  try {
    await unlinkUpsellProduct(productId).then(() => {
      reply
        .status(200)
        .send({ message: "Successfully unlinked upsell product" });
    });
  } catch (error: any) {
    reply.status(400).send({
      error: "Failed to unlink upsell product",
      message: error.message,
    });
  }
}

export async function findProductById(productId: number): Promise<any> {
  try {
    const productById = await product.findOne({
      where: {
        id: productId,
      },
    });

    return productById;
  } catch (error: any) {
    throw new Error(`Error finding product by name: ${error.message}`);
  }
}

async function findProductByName(productName: string): Promise<any> {
  try {
    const productByName = await product.findOne({
      where: {
        name: productName,
      },
    });

    return productByName;
  } catch (error: any) {
    throw new Error(`Error finding product by name: ${error.message}`);
  }
}

async function addProduct(
  name: string,
  price: number,
  description: string,
  quantity: number
): Promise<void> {
  try {
    await product.create({
      name: name,
      description: description,
      price: price,
      quantity: quantity,
      deleted: false,
    });

    return;
  } catch (error: any) {
    throw new Error(`Error adding product: ${error.message}`);
  }
}

async function deleteProduct(name: string): Promise<void> {
  try {
    await product.update(
      { deleted: true },
      {
        where: {
          name: name,
        },
      }
    );

    return;
  } catch (error: any) {
    throw new Error(`Error deleting product: ${error.message}`);
  }
}

async function updateProduct(
  name: string,
  index: number,
  value: string
): Promise<void> {
  try {
    const field: string | null = getColumnNameByIndex(index);
    const currentDateTime = new Date();

    if (field == null) {
      throw new Error("Field value cannot be null to update product");
    }

    await product.update(
      {
        [field]: value,
        updatedAt: currentDateTime,
      },
      {
        where: {
          name: name,
        },
      }
    );

    return;
  } catch (error: any) {
    throw new Error(`Error updating product: ${error.message}`);
  }
}

async function linkUpsellProduct(
  productId: number,
  upsellProductId: number
): Promise<void> {
  try {
    await product.update(
      {
        upsellProductId: upsellProductId,
      },
      {
        where: {
          id: productId,
        },
      }
    );

    return;
  } catch (error: any) {
    throw new Error(`Error linking upsell product: ${error.message}`);
  }
}

async function getUpsellProducts(productId: number): Promise<any> {
  try {
    const upsellProducts = await product.findAll({
      where: {
        upsellProductId: productId,
      },
    });

    return upsellProducts;
  } catch (error: any) {
    throw new Error(`Error finding upsell products: ${error.message}`);
  }
}

async function unlinkUpsellProduct(productId: number): Promise<void> {
  try {
    await product.update(
      {
        upsellProductId: null,
      },
      {
        where: {
          id: productId,
        },
      }
    );

    return;
  } catch (error: any) {
    throw new Error(`Error unlinking upsell product: ${error.message}`);
  }
}

function isValidIndexValueType(index: number, value: any): boolean {
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
