"use client";

import { useState, useEffect, useRef } from "react";
import UserBadge from "./UserBadge";
import { User } from "../../game/logic";

// Interface for individual log entries with timestamp and message
interface LogEntry {
  dt: number;
  message: string;
}

// Props for the ChatUI component
interface ChatUIProps {
  log: LogEntry[];
  onSendMessage: (message: string) => void;
  users: User[];
}

export default function ChatUI({ log, onSendMessage, users }: ChatUIProps) {
  // State for the current message being typed
  const [message, setMessage] = useState("");
  // Ref to the bottom of the chat for auto-scrolling
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scrolls the chat window to the bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll to bottom whenever new log entries are added
  useEffect(() => {
    scrollToBottom();
  }, [log]);

  // Handle form submission to send a message
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  // Format timestamp to display time in HH:MM format
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Parse message to extract userId if it's a chat message (format: "userId: message")
  const parseMessage = (msg: string) => {
    const colonIndex = msg.indexOf(":");
    if (colonIndex > 0) {
      const userId = msg.substring(0, colonIndex).trim();
      const content = msg.substring(colonIndex + 1).trim();
      return { userId, content, isUserMessage: true };
    }
    return { userId: null, content: msg, isUserMessage: false };
  };

  return (
    <div className="flex h-full flex-col border-t border-gray-300">
      {/* Chat log display area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-2">
        {log.map((logEntry) => {
          const { userId, content, isUserMessage } = parseMessage(
            logEntry.message,
          );

          // Find the user's color from the users array
          const user = users.find((u) => u.id === userId);

          return (
            <div
              key={logEntry.dt}
              className="animate-appear flex gap-2 items-start rounded-lg bg-white p-3 shadow-sm"
            >
              {/* Timestamp */}
              <span className="text-xs font-mono text-gray-400 whitespace-nowrap mt-0.5">
                {formatDate(logEntry.dt)}
              </span>

              {/* User badge or Server badge */}
              {isUserMessage && userId && user ? (
                <UserBadge userId={userId} color={user.color} />
              ) : (
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-gray-400 text-white">
                  SERVER
                </span>
              )}

              {/* Message content */}
              <span className="text-sm text-gray-800 flex-1 break-words">
                {content}
              </span>
            </div>
          );
        })}
        {/* Invisible element at the bottom for scrolling reference */}
        <div ref={chatEndRef} />
      </div>
      {/* Message input form */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-300 p-4 bg-white"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
