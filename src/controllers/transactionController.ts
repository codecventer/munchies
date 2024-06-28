import { findProductById, getUpsellProducts } from "./productController";
import transaction from "../models/transaction";

interface TransactionDetails {
  id: number;
  productId: number;
  quantity: number;
  total: string;
  createdAt: string;
}

interface TransactionResponse {
  id: number;
  productId: number;
  quantity: number;
  total: string;
  createdAt: string;
  upsellProducts: any[];
}

interface NewTransactionDetails {
  product_id: number;
  quantity: number;
  total: number;
}

export async function addNewTransaction(
  request: any,
  reply: any
): Promise<any> {
  const { product_id, quantity, total }: NewTransactionDetails =
    request.body as NewTransactionDetails;

  const existingProduct = await findProductById(product_id);

  if (existingProduct == null || existingProduct.dataValues.deleted) {
    return reply.status(400).send({
      error: "Failed to add transaction",
      message: `Product with id '${product_id}' not found`,
    });
  }

  try {
    await addTransaction(product_id, quantity, total).then(() => {
      reply.status(200).send({ message: "Successfully added transaction" });
    });
  } catch (error: any) {
    reply.status(400).send({
      error: "Failed to add transaction",
      message: error.message,
    });
  }
}

export async function getTransactionById(
  request: any,
  reply: any
): Promise<any> {
  const transactionId: number = request.body.transaction_id;

  try {
    const transaction = await getTransaction(transactionId);
    if (transaction == null) {
      reply.status(400).send({
        error: "Failed to get transaction",
        message: `Transaction with id '${transactionId}' not found`,
      });
    }

    const upsellProducts = await getUpsellProducts(transaction.productId);

    const { id, productId, quantity, total, createdAt }: TransactionDetails =
      transaction;

    const response: TransactionResponse = {
      id,
      productId,
      quantity,
      total,
      createdAt,
      upsellProducts: upsellProducts,
    };

    return reply.status(200).send(response);
  } catch (error: any) {
    reply.status(400).send({
      error: "Failed to get transaction",
      message: error.message,
    });
  }
}

async function getTransaction(transactionId: number): Promise<any> {
  try {
    const existingTransaction = await transaction.findOne({
      where: {
        id: transactionId,
      },
    });

    return existingTransaction;
  } catch (error: any) {
    throw new Error(`Error finding transaction: ${error.message}`);
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
