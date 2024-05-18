import sessionRouter from "./sessions.routes.js";
import userRouter from "./users.routes.js";
import postRouter from "./posts.routes.js";
import placeRouter from "./places.routes.js";
import reviewRouter from "./reviews.routes.js";
import chatsRouter from "./chats.routes.js"
const setupRoutes = (app) => {
  app.use("/api/sesiones", sessionRouter);
  app.use("/api/usuarios", userRouter);
  app.use("/api/emprendimientos", postRouter);
  app.use("/api/lugares", placeRouter);
  app.use("/api/calificaciones", reviewRouter);
  app.use("/api/chats", chatsRouter);
};

export default setupRoutes;
