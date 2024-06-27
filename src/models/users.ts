import { Sequelize, DataTypes, Model, Optional } from "sequelize";

const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING || "");

interface UserAttributes {
  id: number;
  emailAddress: string;
  password: string;
  jwtToken?: string | null;
  createdAt: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public emailAddress!: string;
  public password!: string;
  public jwtToken!: string | null;
  public createdAt!: Date;
}

User.init(
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
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "Users",
    timestamps: true,
    underscored: true,
  }
);

export default User;
