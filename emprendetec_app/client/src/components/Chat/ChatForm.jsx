import { useState, useEffect, useRef } from "react";

import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ChatForm(props) {
  const [message, setMessage] = useState("");

  const scrollRef = useRef();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    props.handleFormSubmit(message);
    setMessage("");
  };

  return (
    <div ref={scrollRef}>
      <form onSubmit={handleFormSubmit}>
        <div className="flex w-full items-center justify-between border-b border-gray-200 bg-white p-3 ">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="mx-3 block w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-4 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500 "
            name="message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">
            <FontAwesomeIcon
              icon={faLocationArrow}
              className="h-6 w-6 rotate-45 text-blue-500"
            />
          </button>
        </div>
      </form>
    </div>
  );
}
