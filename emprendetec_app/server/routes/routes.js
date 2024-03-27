import sessionRouter from "./sessions.routes.js";
import userRouter from "./users.routes.js";

const setupRoutes = (app) => {
  app.use("/api/sesiones", sessionRouter);
  app.use("/api/usuarios", userRouter);
};

export default setupRoutes;