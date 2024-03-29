import sessionRouter from "./sessions.routes.js";
import userRouter from "./users.routes.js";
import userDetailsRouter from "./usersDetails.routes.js";

const setupRoutes = (app) => {
  app.use("/api/sesiones", sessionRouter);
  app.use("/api/usuarios", userRouter);
  app.use("/api/detallesUsuarios", userDetailsRouter);
};

export default setupRoutes;