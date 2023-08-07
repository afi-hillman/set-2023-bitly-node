import { DataTypes } from "sequelize";
import postgresConnection from "../connection";
import User from "./User";

const Link = postgresConnection.define(
  "Link",
  {
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    visit_counts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    underscored: true,
    paranoid: true,
    timestamps: true,
  }
);

Link.belongsTo(User, {
  foreignKey: "owner",
});

export default Link;
