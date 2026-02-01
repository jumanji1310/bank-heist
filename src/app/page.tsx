"use client";

import Game from "@/components/Game";
import RoomUI from "@/components/RoomUI";
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
      <div className="min-h-screen bg-gray-100">
        <Game roomId={parsed.data.roomId} username={parsed.data.username} />
        <div className="flex justify-end p-4">
          <button
            onClick={() => router.push("/")}
            className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
          >
            Leave Room
          </button>
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
