import type * as Party from "partykit/server";
import type { Chat, Message, Player, serverData } from "@/app/types";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  chatLog: Chat[] = [];
  playerList: Player[] = [];

  async onStart() {
    this.chatLog = (await this.room.storage.get<Chat[]>("chatLog")) || [];
    this.playerList =
      (await this.room.storage.get<Player[]>("playerList")) || [];
  }

  async saveServer() {
    if (this.chatLog) {
      await this.room.storage.put<Chat[]>("chatLog", this.chatLog);
    }
    if (this.playerList) {
      await this.room.storage.put<Player[]>("playerList", this.playerList);
    }
  }

  async onRequest(req: Party.Request) {
    if (req.method === "POST") {
      const chat = (await req.json()) as Chat;
      this.chatLog.push(chat);
      this.saveServer();
      console.log("Chat created:", chat);
    }

    if (this.chatLog) {
      return new Response(JSON.stringify(this.chatLog), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not found", { status: 404 });
  }

  // when a client sends a message
  onMessage(message: string, sender: Party.Connection) {
    const msg = JSON.parse(message) as Message;

    if (msg.type === "chat") {
      console.log("Chat message received:", msg.data);
      this.chatLog.push(msg.data);
      this.saveServer();
      this.room.broadcast(JSON.stringify(msg));
    } else if (msg.type === "playerJoin") {
      // Store the player's name
      this.playerList.push({
        id: sender.id,
        name: msg.data.name,
      });

      const joinMessage: Message = {
        type: "chat",
        data: {
          senderName: "[SYSTEM]",
          content: `${msg.data.name} (${sender.id}) joined the party!`,
        },
      };

      this.chatLog.push(joinMessage.data);
      this.saveServer();
      this.room.broadcast(JSON.stringify(joinMessage));
    } else if (msg.type === "gameUpdate") {
      this.room.broadcast(JSON.stringify(msg));
    }
  }

  // when a new client connects
  onConnect(connection: Party.Connection) {
    // Send complete server state to the new client
    const serverData: serverData = {
      roomId: this.room.id,
      chatLog: this.chatLog,
      playerList: this.playerList,
      gameData: {
        gameState: "waiting",
        // ... other game data
      },
    };

    const initMessage: Message = {
      type: "init",
      data: serverData,
    };
    connection.send(JSON.stringify(initMessage));
  }

  // when a client disconnects
  onClose(connection: Party.Connection) {
    // Find the player in the list
    const player = this.playerList.find((p) => p.id === connection.id);
    const playerName = player?.name;

    // Remove the player from the list
    this.playerList = this.playerList.filter((p) => p.id !== connection.id);

    const leaveMessage: Message = {
      type: "chat",
      data: {
        senderName: "[SYSTEM]",
        content: `${playerName} (${connection.id}) left the party!`,
      },
    };

    this.chatLog.push(leaveMessage.data);
    this.saveServer();
    this.room.broadcast(JSON.stringify(leaveMessage));
  }
}

Server satisfies Party.Worker;
