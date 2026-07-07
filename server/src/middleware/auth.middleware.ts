import { Request,Response,NextFunction } from "express";
import { verifyToken } from "../lib/jwt";

export const authMiddleware = (
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try{
        const token = req.cookies?.token;

        if(!token) {
            return res.status(401).json({message:"Unauthorized",});
        }
        
        const decoded = verifyToken(token);
        
        req.user = decoded;

        next();
    }catch(error){
        return res.status(401).json({message:"Invalid token"});
    }
};

