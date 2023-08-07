import { DataTypes } from "sequelize";
import postgresConnection from "../connection";

const User = postgresConnection.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    underscored: true,
    paranoid: true,
    timestamps: true,
  }
);

export default User;
