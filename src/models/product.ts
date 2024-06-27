import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

interface ProductAttributes {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  deleted: boolean;
  upsellProductId: number | null;
  updatedAt: Date | null;
  createdAt: Date;
}

interface ProductCreationAttributes
  extends Omit<ProductAttributes, "id" | "updatedAt" | "createdAt"> {}

class product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public quantity!: number;
  public deleted!: boolean;
  public upsellProductId!: number | null;
  public updatedAt!: Date | null;
  public createdAt!: Date;
}

product.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    upsellProductId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "Products",
    modelName: "Product",
    timestamps: false,
    underscored: false,
  }
);

export default product;
