// util for easy adding logs
const addLog = (message: string, logs: GameState["log"]): GameState["log"] => {
  return [...logs, { dt: new Date().getTime(), message: message }];
};

// If there is anything you want to track for a specific user, change this interface
export interface User {
  id: string;
  color?: string;
  role?: string;
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
  target: number;
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
  vaultDeck?: string[];
  alarmDeck?: string[];
}

// This is how a fresh new game starts out, it's a function so you can make it dynamic!
// In the case of the guesser game we start out with a random target
export const initialGame = () => ({
  users: [],
  target: Math.floor(Math.random() * 100),
  log: addLog("Game Created!", []),
});

// Here are all the actions we can dispatch for a user
type GameAction =
  | { type: "guess"; guess: number }
  | { type: "drawVault" }
  | { type: "drawAlarm" }
  | { type: "startGame" };

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
      return {
        ...state,
        users: [...state.users, action.user],
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

      const usersWithRoles = state.users.map((u, i) => ({
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

    case "drawVault":
      return {
        ...state,
        log: addLog(`${action.user.id} drew a vault card 🏦`, state.log),
      };
    case "drawAlarm":
      return {
        ...state,
        log: addLog(`${action.user.id} drew an alarm card 🚨`, state.log),
      };
    case "guess":
      if (action.guess === state.target) {
        return {
          ...state,
          target: Math.floor(Math.random() * 100),
          log: addLog(
            `user ${action.user.id} guessed ${action.guess} and won! 👑`,
            state.log,
          ),
        };
      } else {
        return {
          ...state,
          log: addLog(
            `user ${action.user.id} guessed ${action.guess}`,
            state.log,
          ),
        };
      }
  }
};
