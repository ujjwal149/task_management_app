import jwt from "jsonwebtoken";
import { xid } from "zod";

export const generateToken = (userId: string) => {
    return jwt.sign(
        {userId},
        process.env.JWT_SECRET!,
        {
            expiresIn: "7d"
        }
    );
};

export const verifyToken = (token:string) => {
    return jwt.verify(
        token,
        process.env.JWT_SECRET!
    )as{
        userId:string;
    };
}; 