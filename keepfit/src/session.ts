import * as session from 'express-session';
import { randomBytes } from 'crypto';

declare module 'express-session' {
  interface SessionData {
    user_id: number;
    // isAuthenticated: boolean;
  }
}

export let sessionMiddleware = session({
  resave: false,
  secret: randomBytes(32).toString('hex'),
  saveUninitialized: false,
});

export type SessionType = session.Session & Partial<session.SessionData>;
