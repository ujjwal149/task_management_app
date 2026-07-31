import jwt from "jsonwebtoken";

type JwtPayload = {
  userId: string;
  role: "ADMIN" | "USER";
};

export const generateToken = (payload: JwtPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
};