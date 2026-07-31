import "passport";

declare global {
  namespace Express {
    interface User {
      userId: string;
      role: "ADMIN" | "USER";
    }
  }
}

export {};