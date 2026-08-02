import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getUserById } from "../db/queries/users";

export async function protect(req: Request, res: Response, next: NextFunction){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            message:"Unauthorized",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        const user = await getUserById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({
            message:"Unauthorized",
        });
    }
}