import { useState, useEffect } from "react";

import { createChatRoom } from "../../services/ChatService";
import Contact from "./Contact";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AllUsers({
  chatRooms,
  currentUser,
  changeChat,
  currentChat,
}) {
  const [selectedChat, setSelectedChat] = useState();

  useEffect(() => {
    if (currentChat) {
      const index = chatRooms.findIndex(
        (chatRoom) => chatRoom.chat.id === currentChat.chat.id,
      );
      setSelectedChat(index);
    }
  }, [currentChat, chatRooms]);
  
  const changeCurrentChat = (index, chat) => {
    setSelectedChat(index);
    changeChat(chat);
  };

  return (
    <>
      <ul className="h-[30rem] overflow-auto">
        <h2 className="my-2 mb-2 ml-2 text-gray-900 dark:text-white">Chats</h2>
        <li>
          {chatRooms.map((chatRoom, index) => (
            <div
              key={index}
              className={classNames(
                index === selectedChat
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "cursor-pointer border-b border-gray-200 bg-white transition duration-150 ease-in-out hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700",
                "flex items-center px-3 py-2 text-sm ",
              )}
              onClick={() => changeCurrentChat(index, chatRoom)}
            >
              <Contact chatRoom={chatRoom} currentUser={currentUser} />
            </div>
          ))}
        </li>
      </ul>
    </>
  );
}
