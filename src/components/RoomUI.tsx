"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoomUi({
  createRoom,
}: {
  createRoom: (name: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const router = useRouter();

  const handleJoin = () => {
    if (name && roomCode) {
      router.push(`/${roomCode}?name=${encodeURIComponent(name)}`);
    }
  };

  const handleCreateLobby = async () => {
    if (name) {
      await createRoom(name);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">Bank Heist</h1>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Enter room code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleJoin}
            disabled={!name || !roomCode}
            className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Join Room
          </button>
          <button
            onClick={handleCreateLobby}
            disabled={!name}
            className="rounded-md bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Create Lobby
          </button>
        </div>
      </div>
    </div>
  );
}
