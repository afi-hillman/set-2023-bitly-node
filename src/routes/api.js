import { Router } from "express";
import authController from "../controllers/auth";
import linkController from "../controllers/link";

const apiRoutes = Router();

apiRoutes.post("/register", authController.register);
apiRoutes.post("/login", authController.login);
apiRoutes.get("/logout", authController.logout);

apiRoutes.post("/link", linkController.create);
apiRoutes.put("/link", linkController.update);
apiRoutes.get("/link/:userId", linkController.listAllByUserId);

export default apiRoutes;
