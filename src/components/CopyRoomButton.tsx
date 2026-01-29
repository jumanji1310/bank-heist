"use client";

import { useState } from "react";

export default function CopyRoomButton({ roomId }: { roomId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="rounded-md bg-gray-200 p-2 hover:bg-gray-300"
        title="Copy room ID"
      >
        📋
      </button>
      {copied && (
        <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-sm text-white">
          Copied!
        </span>
      )}
    </div>
  );
}
