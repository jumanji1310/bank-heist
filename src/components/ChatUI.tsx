"use client";

import { Chat, Message } from "@/app/types";
import usePartySocket from "partysocket/react";
import { useState, useEffect, useRef } from "react";
import { PARTYKIT_HOST } from "@/app/env";
export default function ChatUI({
  id,
  playerName,
}: {
  id: string;
  playerName: string;
}) {
  const [chatLog, setChatLog] = useState<Chat[]>([]);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatLog]);

  const socket = usePartySocket({
    host: PARTYKIT_HOST,
    room: id,
    onOpen() {
      console.log("connected");
      // Send player join message with name
      const joinMsg: Message = {
        type: "playerJoin",
        data: { playerId: socket.id, name: playerName },
      };
      socket.send(JSON.stringify(joinMsg));
    },

    onMessage(e) {
      const msg = JSON.parse(e.data) as Message;
      console.log("Received message:", msg);
      if (msg.type === "init") {
        setChatLog(msg.data.chatLog);
        // setGameData(msg.data.gameData);
      } else if (msg.type === "chat") {
        setChatLog((prev) => [...prev, msg.data]);
      }
    },
    onClose() {
      console.log("closed");
    },
    onError(e) {
      console.log("error");
    },
  });

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const chatMessage: Message = {
        type: "chat",
        data: {
          senderName: playerName,
          content: message,
        },
      };
      socket.send(JSON.stringify(chatMessage));
      setMessage("");
    }
  };

  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-4 flex-1 overflow-y-auto rounded-lg bg-gray-100 p-4">
        <h2 className="mb-4 text-xl font-semibold">Chat Log:</h2>
        {chatLog.map((chat, index) => (
          <div key={index} className="mb-3">
            <p className="text-sm font-semibold text-gray-600">
              {chat.senderName}:
            </p>
            <p className="text-gray-800">{chat.content}</p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
}
