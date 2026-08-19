import { api } from "@/lib/api";
import { User } from "@/lib/types";
import { cookies } from "next/headers";
import { decodeToken } from "@/utils/jwt";


export const getMe = async (): Promise<User | null> => {
    const token = (await cookies()).get("accessToken")?.value;

    if (!token) return null;

    const res = await api("/api/auth/me",{
        cache:"no-store",
        headers:{
            Authorization:`Bearer ${token}`
        }
    })

    if(res.ok) return res.data.user

    return decodeToken(token) as User

}