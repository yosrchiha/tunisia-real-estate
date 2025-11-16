// src/types/index.ts

import { Context } from 'hono';

export interface UserPayload {
  userId: string;
  email: string;
  username: string;
  role?: string;
}

export type AuthEnv = {
  Variables: {
    user: UserPayload;
  };
};

export type AuthContext = Context<AuthEnv>;

export interface JWTPayload {
  userId: string;
  email: string;
  roles: string[];
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    roles: string[];
  };
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
  };
}

export interface ErrorResponse {
  error: string;
  message?: string;
}
