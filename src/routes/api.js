import { Router } from "express";
import authController from "../controllers/auth";
import linkController from "../controllers/link";
import isAuthenticated from "../middleware/isAuthenticated";
import { body } from "express-validator";
import { loginValidator } from "../middleware/validator/auth";
import { validate } from "../middleware/validator";
import { createLinkValidator } from "../middleware/validator/link";

const apiRoutes = Router();

apiRoutes.post("/register", authController.register);
apiRoutes.post("/login", loginValidator, validate, authController.login);
apiRoutes.get("/logout", isAuthenticated, authController.logout);

apiRoutes.post(
  "/link",
  isAuthenticated,
  createLinkValidator,
  validate,
  linkController.create
);
apiRoutes.put("/link", isAuthenticated, linkController.update);
apiRoutes.get("/link", isAuthenticated, linkController.listAllByUserId);
apiRoutes.delete("/link", isAuthenticated, linkController.deleteLink);

export default apiRoutes;
