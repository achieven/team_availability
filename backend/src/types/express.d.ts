import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    session: {
      userId?: string;
      userEmail?: string;
      destroy: () => void;
    } & Express.Session;
  }
}
