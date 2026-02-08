"use client";

import { Chat, Message } from "@/app/types";
import usePartySocket from "partysocket/react";
import { useState, useEffect, useRef } from "react";
import { PARTYKIT_HOST } from "@/app/env";

interface LogEntry {
  dt: number;
  message: string;
}

interface ChatUIProps {
  log: LogEntry[];
  onSendMessage: (message: string) => void;
}

export default function ChatUI({ log, onSendMessage }: ChatUIProps) {
  const [message, setMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [log]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    // <div className="flex h-full flex-col p-4">
    //   <div className="mb-4 flex-1 overflow-y-auto rounded-lg bg-gray-100 p-4">
    //     <h2 className="mb-4 text-xl font-semibold">Chat Log:</h2>
    //     {chatLog.map((chat, index) => (
    //       <div key={index} className="mb-3">
    //         <div className="flex items-baseline gap-2">
    //           <p className="text-sm font-semibold text-gray-600">
    //             {chat.senderName}:
    //           </p>
    //           <p className="text-xs text-gray-400">{formatDate(chat.date)}</p>
    //         </div>
    //         <p className="text-gray-800">{chat.text}</p>
    //       </div>
    //     ))}
    //     <div ref={chatEndRef} />
    //   </div>

    //   <form onSubmit={sendMessage} className="flex gap-2">
    //     <input
    //       type="text"
    //       value={message}
    //       onChange={(e) => setMessage(e.target.value)}
    //       placeholder="Type a message..."
    //       className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
    //     />
    //     <button
    //       type="submit"
    //       className="rounded-md bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
    //     >
    //       Send
    //     </button>
    //   </form>
    // </div>
    <div className="flex h-full flex-col border-t border-gray-300">
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
        {log.map((logEntry, i) => (
          <p
            key={logEntry.dt}
            className="animate-appear text-black text-sm mb-1"
          >
            {formatDate(logEntry.dt)}: {logEntry.message}
          </p>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t border-gray-300 p-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
