import userRouter from "./users.routes.js";

const setupRoutes = (app) => {
  app.use("/api/usuarios", userRouter);
};

export default setupRoutes;