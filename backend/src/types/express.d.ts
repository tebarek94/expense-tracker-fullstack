import type { Role } from "../utils/rbac";

declare global {
  namespace Express {
    interface UserContext {
      id: string;
      email: string;
      role: Role;
    }

    interface Request {
      user?: UserContext;
    }
  }
}

export {};
