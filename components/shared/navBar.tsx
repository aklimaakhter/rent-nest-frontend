import { cookies } from "next/headers";
import { logoutAction } from "@/app/auth/_actions/authAction";
import NavbarClient from "./navbarClient";


function getUserRoleFromToken(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return "";
    
    const payloadBase64 = parts[1];
    const decodedPayload = JSON.parse(
      Buffer.from(payloadBase64, "base64").toString("utf-8")
    );
    return decodedPayload.role || decodedPayload.userRole || "";
  } catch (error) {
    return "";
  }
}

export default async function Navbar() {
  let token = "";
  let role = "";

  try {
    const cookieStore = await cookies();
    token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value || "";

    if (token) {
      role = getUserRoleFromToken(token);
    }
  } catch (err) {
    console.error("Navbar cookie error:", err);
  }

  return <NavbarClient token={token} role={role} logoutAction={logoutAction} />;
}