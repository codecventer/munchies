import { findProductById } from "./productController";
import transaction from "../models/transaction";

export async function addNewTransaction(
  request: any,
  reply: any
): Promise<any> {
  const productId: number = request.body.product_id;
  const quantity: number = request.body.quantity;
  const total: number = request.body.total;

  if (!isNewTransactionFieldsValid(productId, quantity, total)) {
    return reply.status(400).send({
      error: "Failed to add transaction",
      message: "Only numeric parameters allowed",
    });
  }

  const existingProduct = await findProductById(productId);

  if (existingProduct == null) {
    return reply.status(400).send({
      error: "Failed to get upsell products",
      message: `Product with ID '${productId}' not found`,
    });
  }

  try {
    await addTransaction(productId, quantity, total).then(() => {
      reply.status(200).send({ message: "Successfully added transaction" });
    });
  } catch (error: any) {
    reply.status(400).send({
      error: "Failed to add transaction",
      message: error.message,
    });
  }
}

async function addTransaction(
  productId: number,
  quantity: number,
  total: number
) {
  try {
    await transaction.create({
      productId: productId,
      quantity: quantity,
      total: total,
    });

    return;
  } catch (error: any) {
    throw new Error(`Error adding transaction: ${error.message}`);
  }
}

function isNewTransactionFieldsValid(
  productId: number,
  quantity: number,
  total: number
): boolean {
  return (
    typeof productId === "number" &&
    typeof productId != null &&
    typeof quantity === "number" &&
    typeof quantity != null &&
    typeof total === "number" &&
    typeof total != null
  );
}
