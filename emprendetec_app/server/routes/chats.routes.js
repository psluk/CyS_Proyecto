import express from "express";
const router = express.Router();
import { runStoredProcedure } from "../config/database/database-provider.js";

router.get("/todos/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const result = await runStoredProcedure("EmprendeTEC_SP_GetChats", {
      IN_Email: email,
    });
    res.json({ data: result });
  } catch (error) {
    console.error("Error al obtener los chats", error);
    res.status(500).json({ message: "Ocurrió un error al obtener los chats." });
  }
});

router.get("/mensajes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await runStoredProcedure("EmprendeTEC_SP_GetMessages", {
      IN_ChatID: id,
    });
    res.json({ data: result });
  } catch (error) {
    console.error("Error al obtener los mensajes del chat", error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al obtener los mensajes del chat." });
  }
});

router.post("/mensaje", async (req, res) => {
  try {
    const { messageBody, sender, chat } = req.body;
    const result = await runStoredProcedure("EmprendeTEC_SP_CreateMessage", {
      IN_MessageBody: messageBody,
      IN_SenderId: sender,
      IN_ChatID: chat,
    });
    res.json({ data: result });
  } catch (error) {
    console.error("Error al enviar el mensaje", error);
    res.status(500).json({ message: "Ocurrió un error al enviar el mensaje." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { sender, receiver, messageBody } = req.body;
    const result = await runStoredProcedure("EmprendeTEC_SP_CreateChat", {
      IN_SenderId: sender,
      IN_ReceiverId: receiver,
      IN_MessageBody: messageBody,
    });
    res.json({ data: result });
  } catch (error) {
    console.error("Error al crear el chat", error);
    res.status(500).json({ message: "Ocurrió un error al crear el chat." });
  }
});
export default router;
