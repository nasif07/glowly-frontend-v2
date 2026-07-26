import type { User } from "./user";

/** Payload returned inside `data` by `/auth/login` and `/auth/google`. */
export interface AuthPayload {
  token: string;
  user: User;
}

/** Persisted auth session (mirrors localStorage `token` + `user`). */
export interface AuthSession {
  token: string | null;
  user: User | null;
}
