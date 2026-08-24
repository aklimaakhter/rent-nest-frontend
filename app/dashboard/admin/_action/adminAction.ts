"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// সব ইউজারের ডাটা ফেচ করার জন্য অ্যাকশন
// app/dashboard/admin/_action/adminAction.ts

export async function getAllUsersAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;

    // ব্যাকএন্ডের সঠিক রুট এবং হেডার ফরম্যাট
    const res = await fetch("http://localhost:5000/api/admin/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // এটি ব্যাকএন্ডের auth মিডলওয়্যারের জন্য জরুরি
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Backend error status:", res.status);
      return { success: false, data: [] };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, data: [] };
  }
}




// ইউজারের স্ট্যাটাস পরিবর্তন করার জন্য অ্যাকশন
export async function toggleUserStatusAction(userId: string, currentStatus: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;
    
    // স্ট্যাটাস টগল করা
    const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";
    
    // পোস্টম্যানের মতো সঠিক রুট এবং হেডার ব্যবহার করা
    const res = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // টোকেন পাস করা বাধ্যতামূলক
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      console.error("Failed to update status, response status:", res.status);
      return { success: false };
    }

    revalidatePath("/dashboard/admin");
    return await res.json();
  } catch (error) {
    console.error("Error updating user status:", error);
    return { success: false };
  }
}