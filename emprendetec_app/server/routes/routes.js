import sessionRouter from "./sessions.routes.js";
import userRouter from "./users.routes.js";
import postRouter from "./posts.routes.js";
import profileRouter from "./profile.routes.js";

const setupRoutes = (app) => {
  app.use("/api/sesiones", sessionRouter);
  app.use("/api/usuarios", userRouter);
  app.use("/api/emprendimientos", postRouter);
  app.use("/api/perfil", profileRouter);
};

export default setupRoutes;