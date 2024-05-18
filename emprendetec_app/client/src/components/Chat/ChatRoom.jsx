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

  // useEffect(() => {
  //   socket.current?.on("getMessage", (data) => {
  //     setIncomingMessage({
  //       senderId: data.senderId,
  //       message: data.message,
  //     });
  //   });
  // }, [socket]);

  useEffect(() => {
    incomingMessage && setMessages((prev) => [...prev, incomingMessage]);
  }, [incomingMessage]);

  const handleFormSubmit = async (message) => {
    if (currentChat.chat.id !== -1) {
      const res = await sendMessage(
        message,
        currentUser.customClaims.userId,
        currentChat.chat.id,
      );

      setMessages([...messages, res.data[0]]);
    } else {
      const res = await createChatRoom(
        currentUser.customClaims.userId,
        currentChat.chat.users[1].user.userId,
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
        <div className="border-b border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
          <Contact chatRoom={currentChat} currentUser={currentUser} />
        </div>

        <div className="relative h-[30rem] w-full overflow-y-auto border-b border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
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
