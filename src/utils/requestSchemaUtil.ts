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
      price: { type: ["integer", "number"] },
      description: { type: "string" },
      quantity: { type: "integer" },
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
      index: { type: "integer" },
      value: { type: ["string", "integer"] },
    },
    required: ["name", "index", "value"],
    additionalProperties: false,
  },
};

export const linkUpsellProductSchema = {
  body: {
    type: "object",
    properties: {
      product_id: { type: "integer" },
      upsell_product_id: { type: "integer" },
    },
    required: ["product_id", "upsell_product_id"],
    additionalProperties: false,
  },
};

export const productUpsellProductsSchema = {
  body: {
    type: "object",
    properties: {
      product_id: { type: "integer" },
    },
    required: ["product_id"],
    additionalProperties: false,
  },
};

export const unlinkUpsellProductSchema = {
  body: {
    type: "object",
    properties: {
      product_id: { type: "integer" },
    },
    required: ["product_id"],
    additionalProperties: false,
  },
};

export const addTransactionSchema = {
  body: {
    type: "object",
    properties: {
      product_id: { type: "integer" },
      quantity: { type: "integer" },
      total: { type: ["integer", "number"] },
    },
    required: ["product_id", "quantity", "total"],
    additionalProperties: false,
  },
};
