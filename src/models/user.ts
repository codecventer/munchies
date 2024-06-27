import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

interface UserAttributes {
  id: number;
  emailAddress: string;
  password: string;
  jwtToken: string | null;
  createdAt: Date;
}

interface UserCreationAttributes
  extends Omit<UserAttributes, "id" | "createdAt"> {}

class user
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public emailAddress!: string;
  public password!: string;
  public jwtToken!: string | null;
  public createdAt!: Date;
}

user.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    emailAddress: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    jwtToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "Users",
    modelName: "User",
    timestamps: false,
    underscored: false,
  }
);

export default user;
