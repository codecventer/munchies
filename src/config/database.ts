import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING!, {
  dialect: "mysql",
  logging: false,
});

export default sequelize;
