import { useState, useEffect } from "react";

import { getUser } from "../../services/ChatService";
import UserLayout from "./UserLayout";

export default function Contact({ chatRoom, currentUser }) {
  const [contact, setContact] = useState();

  useEffect(() => {
    const contact = chatRoom.chat.users.find(
      (member) => member.user.userId !== currentUser.customClaims.userId
    )

    const fetchData = async () => {
      // Asegúrate de que `contact` y `contact.user.userId` están definidos antes de hacer la llamada
      if (contact && contact.user.userId) {
        const res = await getUser(contact.user.userId);
        setContact(res.user[0]);
      } else {
        console.log("No valid contact ID found, not fetching user data.");
      }
    };

    // Ejecutar la función fetchData solo si un contacto válido fue encontrado
    if (contact && contact.user.userId ) {
      fetchData();
    }
  }, [chatRoom, currentUser]);

  return <UserLayout user={contact} />;
}
