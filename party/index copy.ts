import type * as Party from "partykit/server";
import type { Chat, Message, Player, ServerData } from "@/app/types";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  chatLog: Chat[] = [];
  playerList: Player[] = [];

  async onStart() {
    this.chatLog = (await this.room.storage.get<Chat[]>("chatLog")) || [];
    this.playerList =
      (await this.room.storage.get<Player[]>("playerList")) || [];
  }

  // === HELPER METHODS ===

  private async saveServer() {
    await this.room.storage.put<Chat[]>("chatLog", this.chatLog);
    await this.room.storage.put<Player[]>("playerList", this.playerList);
  }

  private broadcast(message: Message) {
    this.room.broadcast(JSON.stringify(message));
  }

  private addChatMessage(senderName: string, text: string) {
    const chat: Chat = {
      senderName,
      text,
      date: Date.now(),
    };
    this.chatLog.push(chat);
    this.saveServer();

    this.broadcast({
      type: "chat",
      data: chat,
    });
  }

  private broadcastPlayerList() {
    this.broadcast({
      type: "playerListUpdate",
      data: this.playerList,
    });
  }

  private getPlayerName(connection: Party.Connection): string | undefined {
    return (connection.state as { name?: string })?.name;
  }

  private sendInitMessage(connection: Party.Connection) {
    const serverData: ServerData = {
      roomId: this.room.id,
      chatLog: this.chatLog,
      playerList: this.playerList,
      gameData: {
        gameState: "waiting",
      },
    };

    const initMessage: Message = {
      type: "init",
      data: serverData,
    };
    connection.send(JSON.stringify(initMessage));
  }

  // === LIFECYCLE METHODS ===

  async onRequest(req: Party.Request) {
    if (req.method === "POST") {
      const chat = (await req.json()) as Chat;
      this.chatLog.push(chat);
      await this.saveServer();
      console.log("Chat created:", chat);
    }

    return new Response(JSON.stringify(this.chatLog), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  onMessage(message: string, connection: Party.Connection) {
    const msg = JSON.parse(message) as Message;
    const playerName = this.getPlayerName(connection);

    console.log(`[${playerName}]:`, msg.type);

    switch (msg.type) {
      case "chat":
        this.chatLog.push(msg.data);
        this.saveServer();
        this.broadcast(msg);
        break;

      case "gameUpdate":
        this.broadcast(msg);
        break;

      default:
        console.warn("Unknown message type:", msg);
    }
  }

  onConnect(connection: Party.Connection, ctx: Party.ConnectionContext) {
    const playerName = new URL(ctx.request.url).searchParams.get("name");

    if (playerName) {
      connection.setState({ name: playerName });
      this.updatePlayerList("add", connection.id, playerName);
    }

    this.sendInitMessage(connection);
  }

  onClose(connection: Party.Connection) {
    const playerName = this.getPlayerName(connection);
    this.updatePlayerList("remove", connection.id, playerName);
    console.log(`Player disconnected: ${playerName} (${connection.id})`);
  }

  private updatePlayerList(
    action: "add" | "remove",
    connectionId: string,
    playerName?: string,
  ) {
    switch (action) {
      case "add":
        if (playerName) {
          this.playerList.push({
            id: connectionId,
            name: playerName,
          });
          this.addChatMessage("[SYSTEM]", `${playerName} joined the party!`);
        }
        break;

      case "remove":
        this.playerList = this.playerList.filter((p) => p.id !== connectionId);
        if (playerName) {
          this.addChatMessage("[SYSTEM]", `${playerName} left the party!`);
        }
        break;
    }

    this.broadcastPlayerList();
  }
}

Server satisfies Party.Worker;
