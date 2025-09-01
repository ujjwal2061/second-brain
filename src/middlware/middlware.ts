import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import type  { Request ,Response ,NextFunction } from "express";
// middleware for the user 

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

function middleware(req:Request,res:Response,next:NextFunction){
    console.log(`${req.method} request made to  ${req.path}`);
    try{
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            status:false,
            message:"No token provide ,please login !",
        });
    }
    const token=authHeader.split(" ")[1];
        const decode =jwt.verify(token!,process.env.JWT as string) as JwtPayload;
        if(decode){
            req.userId=decode.id   
            next();
        }else{
            res.status(403).json({
                message:"You are not logged in"
            })
        }
    }catch(err){
        return res.status(403).json({
            status:false,
            message:"Invalid token ,please login again !1"
        })
    }
}
export default middleware;