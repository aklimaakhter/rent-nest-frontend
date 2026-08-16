/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

type LoginState = {
  success?: boolean;
  message?: string;
  role?: string;
};

export const loginAction = async (previousState: LoginState | null, formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result?.message || "Login failed. Check your credentials.",
      };
    }

    const token = result?.data?.accessToken || result?.data?.token;
    const role = result?.data?.user?.role || result?.data?.role || "LANDLORD";

    if (!token) {
      return {
        success: false,
        message: "No access token received from server",
      };
    }

    const cookieStore = await cookies();

    
    cookieStore.set("accessToken", token, { path: "/", maxAge: 60 * 60 * 24 * 7 });
    cookieStore.set("token", token, { path: "/", maxAge: 60 * 60 * 24 * 7 });
    cookieStore.set("role", role, { path: "/", maxAge: 60 * 60 * 24 * 7 });

    return {
      success: true,
      message: "Login successful",
      role: role,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong during login.",
    };
  }
};