"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";

// সমস্ত ইউজার ফেচ করার অ্যাকশন
export const getAllUsersAction = async () => {
  try {
    const res = await api("/api/admin/users", {
      method: "GET",
    });
    return res;
  } catch (error) {
    console.error("Get Users Error:", error);
    return { ok: false, message: "Failed to load users" };
  }
};

// ইউজার ব্যান/আনব্যান (Status Toggle) করার অ্যাকশন
export const toggleUserStatusAction = async (userId: string, currentStatus: string) => {
  try {
    const newStatus = currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    const res = await api(`/api/admin/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    });

    revalidatePath("/dashboard/admin");
    return res;
  } catch (error) {
    console.error("Toggle Status Error:", error);
    return { ok: false, message: "Failed to update user status" };
  }
};