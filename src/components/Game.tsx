import { useState } from "react";
import { useGameRoom } from "@/hooks/useGameRoom";
import { useRouter } from "next/dist/client/components/navigation";
import CopyRoomButton from "./CopyRoomButton";
import ChatUI from "./ChatUI";
import UserBadge from "./UserBadge";
import { stringToColor } from "@/utils";

interface GameProps {
  username: string;
  roomId: string;
}

const Game = ({ username, roomId }: GameProps) => {
  const { gameState, dispatch } = useGameRoom(username, roomId);
  const router = useRouter();

  // Local state to use for the UI
  const [guess, setGuess] = useState<number>(0);

  // Indicated that the game is loading
  if (gameState === null) {
    return (
      <p>
        <span className="transition-all w-fit inline-block mr-4 animate-bounce">
          🎲
        </span>
        Waiting for server...
      </p>
    );
  }

  const handleGuess = (event: React.SyntheticEvent) => {
    event.preventDefault();
    // Dispatch allows you to send an action!
    // Modify /game/logic.ts to change what actions you can send
    dispatch({ type: "guess", guess: guess });
  };

  const handleSendMessage = (message: string) => {
    // You'll need to add a chat action to your game logic
    dispatch({ type: "Chat", message });
  };

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
            Welcome to room {roomId}, {username}!
          </h1>
          <CopyRoomButton roomId={roomId} />
        </div>
        <>
          <h1 className="text-2xl border-b border-yellow-400 text-center relative">
            🎲 Guess the number!
          </h1>
          <section>
            <form
              className="flex flex-col gap-4 py-6 items-center"
              onSubmit={handleGuess}
            >
              <label
                htmlFor="guess"
                className="text-7xl font-bold text-stone-50 bg-black rounded p-2 text-"
              >
                {guess}
              </label>
              <input
                type="range"
                name="guess"
                id="guess"
                className="opacity-70 hover:opacity-100 accent-yellow-400"
                onChange={(e) => setGuess(Number(e.currentTarget.value))}
                value={guess}
              />
              <button className="rounded border p-5 bg-yellow-400 group text-black shadow hover:animate-wiggle">
                Guess!
              </button>
            </form>

            <div className="border-t border-yellow-400 py-2" />
          </section>
        </>
      </div>
      <div className="flex w-1/3 flex-col justify-end border-l border-gray-300">
        <h2 className="text-lg">
          Players in room <span className="font-bold">{roomId}</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {gameState.users.map((user) => (
            <UserBadge key={user.id} userId={user.id} color={user.color} />
          ))}
        </div>
        <div className="h-1/2">
          <ChatUI
            log={gameState.log}
            onSendMessage={handleSendMessage}
            users={gameState.users}
          />
        </div>
      </div>
    </div>
  );
};

export default Game;
