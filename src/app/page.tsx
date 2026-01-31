import RoomUi from "@/components/RoomUI";
import { redirect } from "next/navigation";
import { Chat } from "./types";

const randomId = () => Math.random().toString(36).substring(2, 6);

export default function Home() {
  async function createRoom(name: string) {
    "use server";

    const newRoomCode = randomId();

    const chat: Chat = {
      senderName: "[SYSTEM]",
      text: "Welcome to the chat!",
      date: Date.now(),
    };
    await fetch(`http://localhost:1999/party/${newRoomCode}`, {
      method: "POST",
      body: JSON.stringify(chat),
      headers: {
        "Content-Type": "application/json",
      },
    });

    redirect(`/${newRoomCode}?name=${encodeURIComponent(name)}`);
  }

  return <RoomUi createRoom={createRoom} />;
}
