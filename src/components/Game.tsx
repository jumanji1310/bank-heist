import { useState } from "react";
import { useGameRoom } from "@/hooks/useGameRoom";
import { useRouter } from "next/dist/client/components/navigation";
import CopyRoomButton from "./CopyRoomButton";
import RolePhase from "./RolePhase";
import RobberyPhase from "./RobberyPhase";
import PlayerSidebar from "./PlayerSidebar";
import PlayerTable from "./PlayerTable";

interface GameProps {
  username: string;
  roomId: string;
}

const Game = ({ username, roomId }: GameProps) => {
  const { gameState, dispatch } = useGameRoom(username, roomId);
  const router = useRouter();

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

  // Find the current user's role
  const currentUser = gameState.users.find((u) => u.id === username);
  const userRole = currentUser?.role;

  const handleSendMessage = (message: string) => {
    // You'll need to add a chat action to your game logic
    dispatch({ type: "Chat", message });
  };

  const handleStartGame = () => {
    dispatch({ type: "startGame" });
  };

  const handleReady = () => {
    dispatch({ type: "ready" });
  };

  const handleDrawVault = () => {
    dispatch({ type: "drawVault" });
  };

  const handleDrawAlarm = () => {
    dispatch({ type: "drawAlarm" });
  };

  // Render different content based on phase
  const renderPhaseContent = () => {
    if (!gameState.phase) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <h1 className="text-4xl font-bold">Waiting to start...</h1>
          {gameState.hostId === username ? (
            <>
              <p className="text-gray-600">Click "Start Game" to begin!</p>
              <button
                onClick={handleStartGame}
                className="rounded-md bg-green-500 px-6 py-3 text-white hover:bg-green-600 font-semibold"
              >
                Start Game
              </button>
            </>
          ) : (
            <p className="text-gray-600">
              Waiting for {gameState.hostId} to start...
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        <div className="h-[65%] overflow-hidden">
          <PlayerTable
            users={gameState.users}
            currentUsername={username}
            currentPlayer={gameState.currentPlayer}
          />
        </div>

        <div className="h-[30%] flex flex-col items-center justify-center overflow-auto">
          {gameState.phase === "role" && (
            <RolePhase
              userRole={userRole}
              teammates={gameState.users.filter(
                (u) =>
                  u.id !== username &&
                  u.role === userRole &&
                  (userRole === "Agent" || userRole === "Rival"),
              )}
              onReady={handleReady}
              isReady={currentUser?.ready || false}
              readyCount={gameState.users.filter((u) => u.ready).length}
              totalPlayers={gameState.users.length}
            />
          )}

          {gameState.phase.startsWith("robbery") && (
            <RobberyPhase
              phaseNumber={gameState.phase.slice(-1)}
              currentUser={currentUser}
              currentPlayer={gameState.currentPlayer}
              username={username}
              onDrawVault={handleDrawVault}
              onDrawAlarm={handleDrawAlarm}
              vaultDeckSize={gameState.vaultDeck.length}
              alarmDeckSize={gameState.alarmDeck.length}
            />
          )}

          {gameState.phase.startsWith("getaway") && (
            <div className="flex flex-col items-center justify-center gap-4">
              <h1 className="text-4xl font-bold">
                Getaway Phase {gameState.phase.slice(-1)}
              </h1>
              <p className="text-gray-600">Escape the scene!</p>
            </div>
          )}

          {gameState.phase === "hideout" && (
            <div className="flex flex-col items-center justify-center gap-4">
              <h1 className="text-4xl font-bold">Hideout</h1>
              <p className="text-gray-600">Divide the loot...</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      <div className="w-2/3 p-4 flex flex-col h-full">
        <div className="h-[5%] flex items-center gap-2 flex-shrink-0">
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
          {userRole && (
            <span className="rounded-full bg-purple-500 px-3 py-1 text-sm font-semibold text-white">
              Role: {userRole}
            </span>
          )}
          {gameState.phase && (
            <span className="rounded-full bg-blue-500 px-3 py-1 text-sm font-semibold text-white">
              Phase: {gameState.phase}
            </span>
          )}
          <CopyRoomButton roomId={roomId} />
        </div>

        <div className="h-[95%] flex-shrink-0 overflow-hidden">
          {renderPhaseContent()}
        </div>
      </div>

      <PlayerSidebar
        roomId={roomId}
        users={gameState.users}
        log={gameState.log}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default Game;
