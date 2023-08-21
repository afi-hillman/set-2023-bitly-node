import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import config from "./config";
import errorHandler from "./middleware/errorHandler";
import fourOhFour from "./middleware/fourOhFour";
import root from "./routes/root";
import initializePostgresConnection from "./database/connection";
import dbInit from "./database/init";
import apiRoutes from "./routes/api";
import session from "express-session";

const app = express();

// Apply most middleware first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: config.clientOrigins[config.nodeEnv],
  })
);
app.use(helmet());
app.use(morgan("tiny"));

// Initialize database
if (config.nodeEnv !== "test") {
  dbInit();
}

// Apply session

// Apply routes before error handling
app.use("/", root);
app.use("/api", apiRoutes);

// Apply error handling last
app.use(fourOhFour);
app.use(errorHandler);

export default app;
