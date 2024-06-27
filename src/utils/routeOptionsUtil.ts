import { RouteShorthandOptions } from "fastify";

export const userRouteOptions: RouteShorthandOptions = {
  schema: {
    body: {
      type: "object",
      required: ["emailAddress", "password"],
      properties: {
        emailAddress: { type: "string" },
        password: { type: "string" },
      },
    },
  },
};

export const productRouteOptions: RouteShorthandOptions = {
  schema: {
    body: {
      type: "object",
      required: ["name", "price", "description", "quantity"],
      properties: {
        name: { type: "string" },
        price: { type: "number" },
        description: { type: "string" },
        quantity: { type: "number" },
      },
    },
  },
};

export const updateProductRouteOptions: RouteShorthandOptions = {
  schema: {
    body: {
      type: "object",
      required: ["index", "value"],
      properties: {
        index: { type: "string" },
        value: { type: "string" },
      },
    },
  },
};
