export const userSchema = {
  body: {
    type: "object",
    properties: {
      emailAddress: { type: "string", format: "email" },
      password: { type: "string", minLength: 8 },
    },
    required: ["emailAddress", "password"],
    additionalProperties: false,
  },
};

export const addProductSchema = {
  body: {
    type: "object",
    properties: {
      name: { type: "string" },
      price: { type: "number" },
      description: { type: "string" },
      quantity: { type: "number" },
    },
    required: ["name", "price", "description", "quantity"],
    additionalProperties: false,
  },
};

export const deleteProductSchema = {
  body: {
    type: "object",
    properties: {
      name: { type: "string" },
    },
    required: ["name"],
    additionalProperties: false,
  },
};

export const updateProductSchema = {
  body: {
    type: "object",
    properties: {
      name: { type: "string" },
      index: { type: "number" },
      value: { type: ["string", "number"] },
    },
    required: ["name", "index", "value"],
    additionalProperties: false,
  },
};

export const linkUpsellProductSchema = {
  body: {
    type: "object",
    properties: {
      product_id: { type: "number" },
      upsell_product_id: { type: "number" },
    },
    required: ["product_id", "upsell_product_id"],
    additionalProperties: false,
  },
};

export const productUpsellProductsSchema = {
  body: {
    type: "object",
    properties: {
      product_id: { type: "number" },
    },
    required: ["product_id"],
    additionalProperties: false,
  },
};

export const unlinkUpsellProductSchema = {
  body: {
    type: "object",
    properties: {
      product_id: { type: "number" },
    },
    required: ["product_id"],
    additionalProperties: false,
  },
};

export const addTransactionSchema = {
  body: {
    type: "object",
    properties: {
      product_id: { type: "number" },
      quantity: { type: "number" },
      total: { type: "number" },
    },
    required: ["product_id", "quantity", "total"],
    additionalProperties: false,
  },
};
