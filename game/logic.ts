import {
  Card,
  VAULT_CARD_DEFINITIONS,
  ALARM_CARD_DEFINITIONS,
  HANDCUFF_CARD_DEFINITIONS,
  buildDeck,
  shuffleDeck,
} from "./cards";

export type { Card };

// util for easy adding logs
const addLog = (message: string, logs: GameState["log"]): GameState["log"] => {
  return [...logs, { dt: new Date().getTime(), message: message }];
};

// If there is anything you want to track for a specific user, change this interface
export interface User {
  id: string;
  color?: string;
  role?: string;
  ready?: boolean;
  hand?: Card[];
  hasDrawnThisPhase?: boolean;
  hasDrawnAlarmThisPhase?: boolean;
}

// Do not change this! Every game has a list of users and log of actions
interface BaseGameState {
  users: User[];
  log: {
    dt: number;
    message: string;
  }[];
}

// Do not change!
export type Action = DefaultAction | GameAction;

// Do not change!
export type ServerAction = WithUser<DefaultAction> | WithUser<GameAction>;

type WithUser<T> = T & { user: User };

export type DefaultAction =
  | { type: "UserEntered" }
  | { type: "UserExit" }
  | { type: "Chat"; message: string };

// This interface holds all the information about your game
export interface GameState extends BaseGameState {
  hostId?: string;
  currentPlayer?: string;
  pendingCard?: Card;
  pendingCardDrawnBy?: string;
  pendingCardRecipient?: string;
  phase?:
    | "role"
    | "robbery1"
    | "robbery2"
    | "robbery3"
    | "robbery4"
    | "getaway1"
    | "getaway2"
    | "getaway3"
    | "getaway4"
    | "hideout";
  vaultDeck: Card[];
  alarmDeck: Card[];
  handcuffDeck: Card[];
  vaultDiscard: Card[];
  alarmDiscard: Card[];
  handcuffDiscard: Card[];
}

// This is how a fresh new game starts out, it's a function so you can make it dynamic!
// In the case of the guesser game we start out with a random target
export const initialGame = () => ({
  users: [],
  hostId: undefined,
  currentPlayer: undefined,
  pendingCard: undefined,
  pendingCardDrawnBy: undefined,
  pendingCardRecipient: undefined,
  log: addLog("Game Created!", []),
  vaultDeck: shuffleDeck(buildDeck(VAULT_CARD_DEFINITIONS, "vault")),
  alarmDeck: shuffleDeck(buildDeck(ALARM_CARD_DEFINITIONS, "alarm")),
  handcuffDeck: shuffleDeck(buildDeck(HANDCUFF_CARD_DEFINITIONS, "handcuff")),
  vaultDiscard: [],
  alarmDiscard: [],
  handcuffDiscard: [],
});

// Here are all the actions we can dispatch for a user
type GameAction =
  | { type: "guess"; guess: number }
  | { type: "drawVault" }
  | { type: "drawAlarm" }
  | { type: "drawHandcuff" }
  | { type: "giveCard"; recipientId: string }
  | { type: "acknowledgeCard" }
  | { type: "startGame" }
  | { type: "ready" };

export const gameUpdater = (
  action: ServerAction,
  state: GameState,
): GameState => {
  // This switch should have a case for every action type you add.

  // "UserEntered" & "UserExit" are defined by default

  // Every action has a user field that represent the user who dispatched the action,
  // you don't need to add this yourself
  switch (action.type) {
    case "UserEntered":
      const isFirstPlayer = state.users.length === 0;
      return {
        ...state,
        users: [...state.users, { ...action.user, hand: [] }],
        hostId: isFirstPlayer ? action.user.id : state.hostId,
        log: addLog(`Player ${action.user.id} joined 🎉`, state.log),
      };

    case "UserExit":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.user.id),
        log: addLog(`Player ${action.user.id} left 😢`, state.log),
      };
    case "Chat":
      return {
        ...state,
        log: addLog(`${action.user.id}: ${action.message}`, state.log),
      };
    case "startGame":
      if (action.user.id !== state.hostId) {
        return {
          ...state,
          log: addLog(`Only the host can start the game!`, state.log),
        };
      }

      const roles = [
        "Agent",
        "Agent",
        "Rival",
        "Rival",
        "Crew",
        "Crew",
        "Crew",
        "Sticky",
      ];

      const shuffledRoles = [...roles].sort(() => Math.random() - 0.5);

      // Randomize user order
      const shuffledUsers = [...state.users].sort(() => Math.random() - 0.5);

      const usersWithRoles = shuffledUsers.map((u, i) => ({
        ...u,
        role: shuffledRoles[i % shuffledRoles.length],
      }));

      console.log(
        "Assigned roles:",
        usersWithRoles.map((u) => `${u.id}: ${u.role}`),
      );

      return {
        ...state,
        users: usersWithRoles,
        phase: "role",
        log: addLog("Roles assigned 🔀", state.log),
      };

    case "drawVault": {
      if (state.vaultDeck.length === 0) {
        return {
          ...state,
          log: addLog(`No vault cards left to draw!`, state.log),
        };
      }

      // Only current player can draw
      if (action.user.id !== state.currentPlayer) {
        return {
          ...state,
          log: addLog(`It's not ${action.user.id}'s turn!`, state.log),
        };
      }

      const currentUserData = state.users.find((u) => u.id === action.user.id);
      if (currentUserData?.hasDrawnThisPhase) {
        return {
          ...state,
          log: addLog(
            `${action.user.id} has already drawn this phase!`,
            state.log,
          ),
        };
      }

      // For robbery phases 2-4, must draw alarm first
      const needsAlarm =
        state.phase &&
        ["robbery2", "robbery3", "robbery4"].includes(state.phase);
      if (needsAlarm && !currentUserData?.hasDrawnAlarmThisPhase) {
        return {
          ...state,
          log: addLog(
            `${action.user.id} must draw an alarm card first!`,
            state.log,
          ),
        };
      }

      const [drawnCard, ...remainingDeck] = state.vaultDeck;

      const updatedUsers = state.users.map((u) =>
        u.id === action.user.id ? { ...u, hasDrawnThisPhase: true } : u,
      );

      return {
        ...state,
        users: updatedUsers,
        vaultDeck: remainingDeck,
        pendingCard: drawnCard,
        pendingCardDrawnBy: action.user.id,
        log: addLog(
          `${action.user.id} drew ${drawnCard.name} 🏦 - choose a player to give it to`,
          state.log,
        ),
      };
    }

    case "giveCard": {
      if (!state.pendingCard || !state.pendingCardDrawnBy) {
        return {
          ...state,
          log: addLog(`No card to give!`, state.log),
        };
      }

      // Only the player who drew can give the card
      if (action.user.id !== state.pendingCardDrawnBy) {
        return {
          ...state,
          log: addLog(
            `Only ${state.pendingCardDrawnBy} can give this card!`,
            state.log,
          ),
        };
      }

      const recipientId = (action as any).recipientId;

      // Set card as pending acknowledgement
      return {
        ...state,
        pendingCardRecipient: recipientId,
        log: addLog(
          `${action.user.id} gave ${state.pendingCard?.name} to ${recipientId} - waiting for acknowledgement...`,
          state.log,
        ),
      };
    }

    case "acknowledgeCard": {
      if (!state.pendingCard || !state.pendingCardRecipient) {
        return {
          ...state,
          log: addLog(`No card to acknowledge!`, state.log),
        };
      }

      // Only the recipient can acknowledge
      if (action.user.id !== state.pendingCardRecipient) {
        return {
          ...state,
          log: addLog(
            `Only ${state.pendingCardRecipient} can acknowledge this card!`,
            state.log,
          ),
        };
      }

      // Add card to recipient's hand
      const updatedUsers = state.users.map((u) =>
        u.id === action.user.id
          ? { ...u, hand: [...(u.hand || []), state.pendingCard] }
          : u.id === state.pendingCardDrawnBy
            ? { ...u, hasDrawnThisPhase: true }
            : u,
      );

      // Advance to next player
      const currentPlayerIndex = updatedUsers.findIndex(
        (u) => u.id === state.currentPlayer,
      );
      const nextPlayerIndex = (currentPlayerIndex + 1) % updatedUsers.length;
      const nextPlayer = updatedUsers[nextPlayerIndex].id;

      const allDrawn = updatedUsers.every((u) => u.hasDrawnThisPhase);

      if (allDrawn && state.phase) {
        const phaseMap: Record<string, string> = {
          robbery1: "robbery2",
          robbery2: "robbery3",
          robbery3: "robbery4",
          robbery4: "getaway1",
        };
        const nextPhase = phaseMap[state.phase];

        if (nextPhase) {
          return {
            ...state,
            users: updatedUsers.map(
              (u): User => ({
                id: u.id,
                color: u.color,
                role: u.role,
                ready: u.ready,
                hand: (u.hand || []) as Card[],
                hasDrawnThisPhase: false,
                hasDrawnAlarmThisPhase: false,
              }),
            ),
            currentPlayer: updatedUsers[0].id,
            pendingCard: undefined,
            pendingCardDrawnBy: undefined,
            pendingCardRecipient: undefined,
            phase: nextPhase as any,
            log: addLog(
              `${action.user.id} acknowledged ${state.pendingCard.name}. All players drawn! Moving to ${nextPhase}...`,
              state.log,
            ),
          };
        }
      }

      return {
        ...state,
        users: updatedUsers.map(
          (u): User => ({
            id: u.id,
            color: u.color,
            role: u.role,
            ready: u.ready,
            hand: (u.hand || []) as Card[],
            hasDrawnThisPhase: u.hasDrawnThisPhase,
            hasDrawnAlarmThisPhase: u.hasDrawnAlarmThisPhase,
          }),
        ),
        currentPlayer: nextPlayer,
        pendingCard: undefined,
        pendingCardDrawnBy: undefined,
        pendingCardRecipient: undefined,
        log: addLog(
          `${action.user.id} acknowledged ${state.pendingCard.name}`,
          state.log,
        ),
      };
    }

    case "drawAlarm": {
      if (state.alarmDeck.length === 0) {
        return {
          ...state,
          log: addLog(`No alarm cards left to draw!`, state.log),
        };
      }

      // Only current player can draw
      if (action.user.id !== state.currentPlayer) {
        return {
          ...state,
          log: addLog(`It's not ${action.user.id}'s turn!`, state.log),
        };
      }

      const currentUserData = state.users.find((u) => u.id === action.user.id);
      if (currentUserData?.hasDrawnAlarmThisPhase) {
        return {
          ...state,
          log: addLog(
            `${action.user.id} has already drawn an alarm card!`,
            state.log,
          ),
        };
      }

      const [drawnCard, ...remainingDeck] = state.alarmDeck;
      const updatedUsers = state.users.map((u) =>
        u.id === action.user.id
          ? {
              ...u,
              hand: [...(u.hand || []), drawnCard],
              hasDrawnAlarmThisPhase: true,
            }
          : u,
      );

      return {
        ...state,
        alarmDeck: remainingDeck,
        users: updatedUsers,
        log: addLog(`${action.user.id} drew ${drawnCard.name} 🚨`, state.log),
      };
    }

    case "drawHandcuff": {
      if (state.handcuffDeck.length === 0) {
        return {
          ...state,
          log: addLog(`No handcuff cards left to draw!`, state.log),
        };
      }

      const [drawnCard, ...remainingDeck] = state.handcuffDeck;
      const updatedUsers = state.users.map((u) =>
        u.id === action.user.id
          ? { ...u, hand: [...(u.hand || []), drawnCard] }
          : u,
      );

      return {
        ...state,
        handcuffDeck: remainingDeck,
        users: updatedUsers,
        log: addLog(`${action.user.id} drew ${drawnCard.name} 🔗`, state.log),
      };
    }

    case "ready": {
      const updatedUsers = state.users.map((u) =>
        u.id === action.user.id ? { ...u, ready: true } : u,
      );

      const allReady = updatedUsers.every((u) => u.ready);

      if (allReady && state.phase === "role") {
        return {
          ...state,
          users: updatedUsers.map((u) => ({
            ...u,
            ready: false,
            hasDrawnThisPhase: false,
            hasDrawnAlarmThisPhase: false,
          })),
          currentPlayer: updatedUsers[0].id,
          phase: "robbery1",
          log: addLog("All players ready! Starting robbery... 🎯", state.log),
        };
      }

      return {
        ...state,
        users: updatedUsers,
        log: addLog(`${action.user.id} is ready ✓`, state.log),
      };
    }
    default:
      return state;
  }
};
