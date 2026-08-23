/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { api } from "@/lib/api";
import { LoginState } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const setAuthCookies = async ({ accessToken, refreshToken }: { accessToken: string, refreshToken: string }) => {
  const cookie = await cookies();

  cookie.set("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    sameSite: "lax"
  })
  cookie.set("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax"
  })

}
// export const loginAction = async (previousState: LoginState | null, formData: FormData) => {
//   const email = formData.get("email");
//   const password = formData.get("password");


//   const res = await api("/api/auth/login", {

//     method: "POST",

//     body: JSON.stringify({ email, password }),
//   });


//   if (!res.ok) {
//     return {
//       success: false,
//       message: "Login failed. Check your credentials.",
//     };
//   }

//   await setAuthCookies(res.data)
//   redirect("/dashboard")
// }
export const loginAction = async (previousState: LoginState | null, formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  const res = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    return {
      success: false,
      message: "Login failed. Check your credentials.",
    };
  }

  await setAuthCookies(res.data);
  
  let userRole = "LANDLORD";
  try {
    const accessToken = res.data?.accessToken || res.data?.token;
    if (accessToken) {
      const payloadBase64 = accessToken.split(".")[1];
      const decodedPayload = JSON.parse(
        Buffer.from(payloadBase64, "base64").toString("utf-8")
      );
      userRole = decodedPayload.role || decodedPayload.userRole || "LANDLORD";
    }
  } catch (error) {
    console.error("Failed to decode token role", error);
  }

  if (userRole === "LANDLORD") {
    redirect("/dashboard/landlord");
  } else if (userRole === "TENANT") {
    redirect("/properties"); 
  } else {
    redirect("/");
  }
};

// export const registerAction = async (previousState: LoginState | null, formData: FormData) => {
//   const name = formData.get("name");
//   const email = formData.get("email");
//   const password = formData.get("password");
//   const role = formData.get("role");

//   const res = await api("/api/auth/register", {

//     method: "POST",

//     body: JSON.stringify({ name, email, password, role }),
//   });

// console.log(res,"Register API Response:")
//   if (!res.ok) {
//     return {
//       success: false,
//       message: "Register failed. Check your credentials.",
//     };
//   }
//   const login = await api("/api/auth/login", {
//     method: "POST",
//     body: JSON.stringify({
//       email, password
//     })

//   })
//   await setAuthCookies(login.data);
//   redirect("/auth/login")
// }

export const registerAction = async (previousState: LoginState | null, formData: FormData) => {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role");

  try {
    const res = await api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    });

    console.log(res, "Register API Response:");

    // যদি ব্যাকএন্ড থেকে এরর রিটার্ন করে
    if (res && res.success === false) {
      return {
        success: false,
        message: res.message || "Register failed. Check your credentials.",
      };
    }

    // সফল হলে লগইন পেজে রিডাইরেক্ট হবে
    redirect("/auth/login");
  } catch (error: any) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: error.message || "Something went wrong during registration.",
    };
  }
};

// export const logoutAction = async () => {
//   const cookie = await cookies();
//   cookie.delete("accessToken")
//   cookie.delete("refreshToken")

//   revalidatePath("/");

//   redirect("/auth/login");
// }

export const logoutAction = async () => {
  const cookieStore = await cookies();
  
  // পাথ সহ কুকি ডিলিট করা বাধ্যতামূলক
  cookieStore.set("token", "", { maxAge: 0, path: "/" });
  cookieStore.set("accessToken", "", { maxAge: 0, path: "/" });
  cookieStore.set("refreshToken", "", { maxAge: 0, path: "/" });

  // অতিরিক্ত সুরক্ষার জন্য ডিলিট মেথড
  cookieStore.delete("token");
  cookieStore.delete("accessToken");

  revalidatePath("/", "layout");
  redirect("/auth/login");
};


