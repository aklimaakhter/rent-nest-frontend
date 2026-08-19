import { User } from "@/lib/types"
import jwt from "jsonwebtoken"

export const decodeToken=(token:string)=>{
    if(!token) return null;
    return jwt.decode(token) as User
}