import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, getUserByEmail } from "../db/queries/users";

export async function register(req: Request, res: Response) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }

    try {
        const existUser = await getUserByEmail(email);
        if (existUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const user = await createUser(email, passwordHash, name);

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
            expiresIn: "3d",
        });

        res.cookie("token", token, {
            maxAge: 3 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
        });

        return res.status(201).json({
            message: "User registered successfully",
            token,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export async function login(req: Request, res: Response){
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({
            message:"All fields are required",
        });
    }
    try {
        const user = await getUserByEmail(email);
        if(!user){
            return res.status(404).json({
                message:"Invalid credentials",
            });
        }

        const isPasswordValid = await bcrypt.compare(password,user.password_hash);
        if(!isPasswordValid){
            return res.status(401).json({
                message:"Invalid credentials",
            });
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET!, {
            expiresIn: "3d",
        });

        res.cookie("token", token, {
            maxAge: 3 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
        });

        return res.status(200).json({
            message:"User logged in successfully",
            token,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal server error",
        });
    }
}


export async function logout(req: Request, res: Response) {
    res.clearCookie("token",{
        httpOnly:true,
        sameSite:"strict",
    })

    return res.status(200).json({
        message: "User logged out successfully",
    });
}

export async function getMe(req: Request, res: Response){
    const { password_hash: _password_hash, ...safeUser } = req.user!;
    return res.status(200).json({
        message: "User fetched successfully",
        user: safeUser,
    });
}
