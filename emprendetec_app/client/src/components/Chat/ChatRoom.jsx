import { useState, useEffect, useRef } from "react";

import {
  getMessagesOfChatRoom,
  sendMessage,
  createChatRoom,
} from "../../services/ChatService";

import Message from "./Message";
import Contact from "./Contact";
import ChatForm from "./ChatForm";

export default function ChatRoom({
  currentChat,
  currentUser,
  socket,
  setChatRooms,
  chatRooms,
  setCurrentChat,
}) {
  const [messages, setMessages] = useState([]);
  const [incomingMessage, setIncomingMessage] = useState(null);

  const scrollRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getMessagesOfChatRoom(currentChat.chat.id);
      setMessages(res.data);
    };

    if (currentChat && currentChat.chat.id != -1) fetchData();
    else setMessages([]);
  }, [currentChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    socket.current?.on("getMessage", async (data) => {
      const res = await getMessagesOfChatRoom(currentChat.chat.id);
      setMessages(res.data);
    });
  }, [socket]);

  useEffect(() => {
    incomingMessage && setMessages((prev) => [...prev, incomingMessage]);
  }, [incomingMessage]);

  const handleFormSubmit = async (message) => {
    const senderId = currentUser.customClaims.userId;
    const receiverId = currentChat.chat.users.find(
      (user) => user.user.userId !== senderId,
    ).user.userId;

    if (currentChat.chat.id !== -1) {
      const res = await sendMessage(message, senderId, currentChat.chat.id);

      setMessages([...messages, res.data[0]]);

      socket.current?.emit("sendMessage", {
        senderId: senderId,
        receiverId: receiverId,
        message: message,
      });
    } else {
      const res = await createChatRoom(
        currentUser.customClaims.userId,
        receiverId,
        message,
      );

      const chat = JSON.parse(res.data[0].results)[0];
      const chats = chatRooms.filter((chat) => chat.chat.id !== -1);
      setCurrentChat(chat);
      setChatRooms([chat, ...chats]);
    }
  };

  return (
    <div className="lg:col-span-2 lg:block">
      <div className="w-full">
        <div className="border-b border-gray-200 bg-white p-3 ">
          <Contact chatRoom={currentChat} currentUser={currentUser} />
        </div>

        <div className="relative h-[30rem] w-full overflow-y-auto border-b border-gray-200 bg-white p-6 ">
          <ul className="space-y-2">
            {messages.map((message, index) => (
              <div key={index} ref={scrollRef}>
                <Message message={message} self={currentUser} />
              </div>
            ))}
          </ul>
        </div>

        <ChatForm handleFormSubmit={handleFormSubmit} />
      </div>
    </div>
  );
}
