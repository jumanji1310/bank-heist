"use client";

import Game from "@/components/Game";
import RoomUI from "@/components/RoomUI";
import ChatUI from "@/components/ChatUI";
import CopyRoomButton from "@/components/CopyRoomButton";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

const queryParamsValidator = z.object({
  username: z.string().min(1),
  roomId: z.string().min(1),
});

export default function Home() {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  // Read and validate from URL directly
  const urlUsername = searchParams.get("username");
  const urlRoomId = searchParams.get("roomId");
  const parsed = queryParamsValidator.safeParse({
    username: urlUsername,
    roomId: urlRoomId,
  });

  const handleJoin = () => {
    if (!name || !roomId) {
      alert("Please provide a name and room ID!");
    } else {
      router.push(`/?username=${name}&roomId=${roomId}`);
    }
  };

  const handleCreateLobby = () => {
    if (!name) {
      alert("Please provide a name!");
    } else {
      const newRoomId = Math.random().toString(36).substring(2, 6);
      router.push(`/?username=${name}&roomId=${newRoomId}`);
    }
  };

  // Show game if URL has valid params
  if (parsed.success) {
    return (
      <div className="flex h-screen">
        <div className="w-2/3 p-4">
          <div className="mb-4 flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="rounded-md bg-gray-200 p-2 hover:bg-gray-300"
              title="Return to home"
            >
              🏠
            </button>
            <h1 className="text-2xl font-bold">
              Welcome to room {parsed.data.roomId}, {parsed.data.username}!
            </h1>
            <CopyRoomButton roomId={parsed.data.roomId} />
          </div>
          <Game roomId={parsed.data.roomId} username={parsed.data.username} />
        </div>
        <div className="flex w-1/3 flex-col justify-end border-l border-gray-300">
          <div className="h-1/2">
            <ChatUI id={parsed.data.roomId} playerName={parsed.data.username} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <RoomUI
      name={name}
      roomId={roomId}
      onNameChange={setName}
      onRoomIdChange={setRoomId}
      onJoin={handleJoin}
      onCreateLobby={handleCreateLobby}
    />
  );
}
