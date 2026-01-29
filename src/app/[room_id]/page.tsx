import { notFound } from "next/navigation";
import { Chat } from "../types";
import ChatUI from "@/components/ChatUI";
import CopyRoomButton from "@/components/CopyRoomButton";

export default async function RoomPage({
  params,
  searchParams,
}: {
  params: Promise<{ room_id: string }>;
  searchParams: Promise<{ name?: string }>;
}) {
  const { room_id: roomId } = await params;
  const { name } = await searchParams;

  if (!name) {
    notFound();
  }

  const req = await fetch(`http://localhost:1999/party/${roomId}`, {
    method: "GET",
    next: { revalidate: 0 },
  });

  if (!req.ok) {
    if (req.status === 404) {
      notFound();
    } else {
      throw new Error("Something went wrong.");
    }
  }

  const chat = (await req.json()) as Chat;
  return (
    <div className="flex h-screen">
      <div className="w-2/3 p-4">
        <div className="mb-4 flex items-center gap-2">
          <h1 className="text-2xl font-bold">
            Welcome to room {roomId} {name}!
          </h1>
          <CopyRoomButton roomId={roomId} />
        </div>
      </div>
      <div className="flex w-1/3 flex-col justify-end">
        <div className="h-1/2">
          <ChatUI id={roomId} playerName={name} />
        </div>
      </div>
    </div>
  );
}
