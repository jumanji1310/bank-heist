export type Chat = {
  senderName: string;
  content: string;
};

export type Player = {
  id: string;
  name: string;
};

export type GameData = {
  //   players: Player[];
  gameState: string;
  // ... other game data
};

export type Message =
  | { type: "init"; data: serverData }
  | { type: "chat"; data: Chat }
  | { type: "gameUpdate"; data: GameData }
  | { type: "playerJoin"; data: { playerId: string; name: string } };

export type serverData = {
  roomId: string;
  chatLog: Chat[];
  playerList: Player[];
  gameData: GameData;
};
