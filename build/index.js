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
const passwordUtil_1 = require("./utils/passwordUtil");
dotenv.config();
const fastify = (0, fastify_1.default)({ logger: true });
const PORT = parseInt(process.env.PORT || "8080", 10);
const userRouteOptions = {
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
fastify.register(mysql_1.default, {
    connectionString: process.env.DB_CONNECTION_STRING,
});
fastify.post("/users/register", userRouteOptions, async (request, reply) => {
    const { emailAddress, password } = request.body;
    try {
        const existingUser = await new Promise((resolve, reject) => {
            fastify.mysql.query(`SELECT * FROM munch_pos.Users WHERE emailAddress = ?`, [emailAddress], (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        });
        if (existingUser.length > 0) {
            return reply.status(400).send({
                error: "User already exists",
                message: "User email address already registered",
            });
        }
        await new Promise(async (resolve, reject) => {
            const hashedPassword = await (0, passwordUtil_1.encryptPassword)(password);
            fastify.mysql.query(`INSERT INTO munch_pos.Users (emailAddress, password) VALUES (?, ?);`, [emailAddress, hashedPassword], (error) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        })
            .then(() => {
            reply.status(200).send({ message: "User registration successful" });
        })
            .catch((error) => {
            reply
                .status(400)
                .send({ error: "User registration failed", message: error.message });
        });
    }
    catch (error) {
        reply
            .status(400)
            .send({ error: "User registration failed", message: error.message });
    }
});
fastify.post("/users/login", userRouteOptions, async (request, reply) => {
    const { emailAddress, password } = request.body;
    try {
        const existingUser = await new Promise((resolve, reject) => {
            fastify.mysql.query(`SELECT * FROM munch_pos.Users WHERE emailAddress = ?`, [emailAddress], (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        });
        const hashedPassword = existingUser[0].password;
        const isPasswordCorrect = await (0, passwordUtil_1.isCorrectPassword)(password, hashedPassword);
        if (isPasswordCorrect) {
            reply.status(200).send({ message: "User login successful" });
        }
        else {
            reply.status(400).send({
                error: "Invalid password",
                message: "Password is not correct",
            });
        }
    }
    catch (error) {
        reply
            .status(400)
            .send({ error: "User login failed", message: error.message });
    }
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
