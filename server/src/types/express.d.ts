import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: "ADMIN" | "USER";
      };

      file?: Express.Multer.File;
    }
  }
}

export {};