import { useEffect, useRef, useState } from "react";

import {
  getChatRooms,
  initiateSocketConnection,
} from "../services/ChatService";

import { useSession } from "../context/SessionContext";
import { useParams } from "react-router-dom";
import ChatRoom from "../components/Chat/ChatRoom";
import Welcome from "../components/Chat/Welcome";
import AllUsers from "../components/Chat/AllUsers";
import SearchUsers from "../components/Chat/SearchUsers";

export default function ChatLayout() {
  const [users, setUsers] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);

  const [currentChat, setCurrentChat] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const socket = useRef();

  const { user, getUserEmail, token } = useSession();
  const email = getUserEmail();
  const { id } = useParams();

  useEffect(() => {
    const getSocket = async () => {
      console.log("Getting socket");
      const res = await initiateSocketConnection(token);
      socket.current = res;
      socket.current.emit("addUser", user.customClaims.userId);
    };

    if (user) getSocket();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (email) {
        const res = await getChatRooms(getUserEmail());
        const results = JSON.parse(res.data[0].results);
        setChatRooms(results);

        // Agrega usuarios para búsqueda u otras funciones
        const usersToAdd = results.map((result) => {
          return result.chat.users.find(
            (member) => member.user.userId !== user.customClaims.userId,
          );
        
        });

        setUsers(usersToAdd);

        // Si hay un ID de sala especificado en la URL, trata de encontrar esa sala
        if (id) {
          const chat = results.find(
            (room) =>
              room.chat.users[0].user.userId === parseInt(id) ||
              room.chat.users[1].user.userId === parseInt(id),
          );
          if (chat) {
            setCurrentChat(chat);
          } else if (user && user.customClaims && user.customClaims.userId) {
            // Crea un nuevo chat si no existe
            const newChat = {
              chat: {
                id: -1, // Asumiendo que -1 es un placeholder hasta que se confirme desde el backend
                messages: [],
                users: [
                  { user: { userId: user.customClaims.userId } },
                  { user: { userId: parseInt(id) } },
                ],
              },
            };
            setChatRooms((prevRooms) => [newChat, ...prevRooms]); // Asegura inmutabilidad
            setCurrentChat(newChat);
          }
        }
      }
    };

    fetchData();
  }, [email, id, user]);

  useEffect(() => {
    setFilteredRooms(chatRooms);
  }, [users, chatRooms]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  const handleSearch = (newSearchQuery) => {
    setSearchQuery(newSearchQuery);

    const searchedUsers = users.filter((user) => {
      const userFullName = `${user.user.givenName} ${user.user.familyName}`;
      return userFullName.toLowerCase().includes(newSearchQuery.toLowerCase());
    });

    const searchedUsersId = searchedUsers.map((user) => user.user.userId);
    if (chatRooms.length) {
      const searchedRooms = chatRooms.filter((room) => {
        const otherUser = room.chat.users.find((member) => {
          return member.user.userId !== user.customClaims.userId;
        });

        return searchedUsersId.includes(otherUser.user.userId);
      });
      setFilteredRooms(searchedRooms);
    }
  };

  return (
    <main className="relative w-full max-w-7xl space-y-10 px-10">
      <div className="min-w-full rounded border-x border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 lg:grid lg:grid-cols-3">
        <div className="border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 lg:col-span-1">
          <SearchUsers handleSearch={handleSearch} />

          <AllUsers
            chatRooms={searchQuery !== "" ? filteredRooms : chatRooms}
            currentUser={user}
            changeChat={handleChatChange}
            currentChat={currentChat}
          />
        </div>

        {currentChat ? (
          <ChatRoom
            currentChat={currentChat}
            currentUser={user}
            socket={socket}
            setChatRooms={setChatRooms}
            chatRooms={chatRooms}
            setCurrentChat={setCurrentChat}
          />
        ) : (
          <Welcome />
        )}
      </div>
    </main>
  );
}
