import { Request,Response,NextFunction } from "express";
import prisma from "../lib/prisma";

export const adminMiddleware = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try{
        const user = await prisma.user.findUnique({
            where:{
                id: req.user!.userId,
            },
        });
        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        if (user.role !== "ADMIN"){
            return res.status(403).json({message:"Access denied. Admin only",})
        }

        next();
    }catch(error){
        return res.status(500).json({
            message:"Internal server error",
        });
    }
};