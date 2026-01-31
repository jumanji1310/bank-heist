// === PLAYER TYPES ===
export type Player = {
  id: string;
  name: string;
};

// === CHAT TYPES ===
export type Chat = {
  senderName: string;
  text: string;
  date: number;
};

// === GAME TYPES ===
export type GameData = {
  gameState: "waiting" | "playing" | "finished";
  // Add other game data as needed
};

export type ServerData = {
  roomId: string;
  chatLog: Chat[];
  playerList: Player[];
  gameData: GameData;
};

// === MESSAGE TYPES ===
export type Message =
  | { type: "init"; data: ServerData }
  | { type: "chat"; data: Chat }
  | { type: "gameUpdate"; data: GameData }
  | { type: "playerListUpdate"; data: Player[] };
