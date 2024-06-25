"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const mysql_1 = __importDefault(require("@fastify/mysql"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const fastify = (0, fastify_1.default)({ logger: true });
const PORT = parseInt(process.env.PORT || "8080", 10);
fastify.register(mysql_1.default, {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    promise: true,
});
// Controllers
// fastify.register(fooController, { prefix: "/foo" });
fastify.get("/", async (request, reply) => {
    return JSON.stringify("Hello there! 👋");
});
const start = async () => {
    try {
        await fastify.listen({ port: PORT });
        fastify.log.info(`Server running on port: ${PORT}`);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};
start();
