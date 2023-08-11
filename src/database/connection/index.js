import { Sequelize } from "sequelize";
import config from "../../config";

const { database, user, password, host, port } = config.postgres;

export const postgresConnection = new Sequelize(database, user, password, {
  host: host,
  port: port,
  dialect: "postgres",
  logging: config.nodeEnv === "production",
  dialectOptions: {
    ssl:
      config.nodeEnv === "production"
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
  },
});

export default postgresConnection;
