import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Product from "./product";

interface TransactionAttributes {
  id: number;
  productId: number;
  quantity: number;
  total: number;
  createdAt: Date;
}

interface TransactionCreationAttributes
  extends Omit<TransactionAttributes, "id" | "createdAt"> {}

class transaction
  extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes
{
  public id!: number;
  public productId!: number;
  public quantity!: number;
  public total!: number;
  public createdAt!: Date;

  public static initialize(sequelize: any) {
    transaction.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        productId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        total: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "Transactions",
        modelName: "Transaction",
        timestamps: false,
        underscored: false,
      }
    );
  }

  public static associate() {
    transaction.belongsTo(Product, {
      foreignKey: "productId",
      as: "product",
    });
  }
}

transaction.initialize(sequelize);

export default transaction;
