import axios from "axios";
// import { io } from "socket.io-client";

const baseURL = "/api";

// export const initiateSocketConnection = async () => {

//   const socket = io("http://localhost:3001", {

//   });

//   return socket;
// };

export const getUser = async (userId) => {
  try {
    const res = await axios.get(`${baseURL}/usuarios/${userId}`);
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export const getChatRooms = async (userEmail) => {
  try {
    const res = await axios.get(`${baseURL}/chats/todos/${userEmail}`);
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export const createChatRoom = async (sender, receiver, messageBody) => {
  try {
    const res = await axios.post(`${baseURL}/chats`, {
      sender,
      receiver,
      messageBody,
    });
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export const getMessagesOfChatRoom = async (chatRoomId) => {
  try {
    const res = await axios.get(`${baseURL}/chats/mensajes/${chatRoomId}`);
    return res.data;
  } catch (e) {
    console.error(e);
  }
};

export const sendMessage = async (messageBody, sender, chat) => {
  try {
    const res = await axios.post(`${baseURL}/chats/mensaje`, {
      messageBody,
      sender,
      chat,
    });
    return res.data;
  } catch (e) {
    console.error(e);
  }
};
