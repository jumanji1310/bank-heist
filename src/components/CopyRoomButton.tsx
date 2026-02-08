"use client";

import { useState } from "react";

// Component that displays a button to copy the room ID to clipboard
export default function CopyRoomButton({ roomId }: { roomId: string }) {
  // State to track if the room ID was just copied (for showing feedback)
  const [copied, setCopied] = useState(false);

  // Handle copying the room ID to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    // Hide the "Copied!" message after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      {/* Copy button with clipboard emoji */}
      <button
        onClick={handleCopy}
        className="rounded-md bg-gray-200 p-2 hover:bg-gray-300"
        title="Copy room ID"
      >
        📋
      </button>
      {/* Temporary "Copied!" tooltip that appears after clicking */}
      {copied && (
        <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-sm text-white">
          Copied!
        </span>
      )}
    </div>
  );
}
