import { Request,Response } from "express";
import { signupSchema } from "../validations/signup.schema";
import {signinSchema} from "../validations/signin.schema";
import {generateToken} from "../lib/jwt"
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";


//SignUp logic
export const signup = async(req:Request,res:Response) =>{
    try{
        const validatedData = signupSchema.parse(req.body)

        const existingUsers = await prisma.user.findUnique({
            where:{
                email: validatedData.email,
            },
        });

        if(existingUsers){
            return res.status(400).json({
                message:"User already exists",  
            });
        }

        /* --Hashed password-- */
        const hashedPassword = await bcrypt.hash(
            validatedData.password,10
        )


        const user = await prisma.user.create({
            data:{
                name: validatedData.name,
                email: validatedData.email,
                password: hashedPassword,
            },
        });

        const token = generateToken(user.id);

        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(201).json({
            message:"User created successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    }catch(error){

        console.log(error);

        return res.status(500).json({message:"Internal server error"});
    }
};

//SignIn

export const signin = async(
    req:Request,
    res:Response
) => {
    try{
        const validatedData = signinSchema.parse(req.body)

        const user = await prisma.user.findUnique({
            where:{
                email:validatedData.email,
            }
        });
        if(!user){
            return res.status(400).json({message:"Invalid credentials",});
        };



        const  isPasswordValid = 
            await bcrypt.compare(
                validatedData.password,
                user.password
            );
        
        if(!isPasswordValid) {
            return res.status(400).json({
                message:"Invalid credentials",
            });
        }


        const token = generateToken(user.id);

        res.cookie("token",token,
            {
                httpOnly:true,
                secure:false,
                sameSite:"lax",
                maxAge:7*24*60*60*1000,
            });

        return res.status(200).json({
            message:"Signin successful",
            user:{
                id: user.id,
                name: user.name,
                avatar: user.avatar ,
                email: user.email,
                role: user.role,
            },
        });
    }catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Internal server error."
        })
    }
}

//Logout
export const logout = (
    req:Request,
    res:Response,
) => {
    res.clearCookie("token",{
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });

    return res.status(200).json({
        message: "Logged out sucessfully",
    })
}

//Login me
export const me = async(req:Request,res:Response) => {
    try{
        const user = await prisma.user.findUnique({
            where:{
                id: req.user!.userId,
            },
            select:{
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
                createdAt: true,
            },
        });
        if (!user){
            return res.status(404).json({
                message:"User not found.",
            });
        }

        return res.status(200).json({
            user,
        });
    }catch(error){
        console.log(error);

        return res.status(500).json({message:"Internal Server error",});
    }
};

//Admin Only access
export const adminOnly = async (
    req:Request,
    res:Response
) => {
    return res.status(200).json({
        message:"Welcome Admin!"
    });
};

