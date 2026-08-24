/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { api } from "@/lib/api";
import { cookies } from "next/headers";

export async function fetchRentalDetailsAction(requestId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || cookieStore.get("accessToken")?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    
    const res: any = await api(`/api/rentals/${requestId}`, {
      method: "GET",
      headers,
    });

    if (res && (res.success || res.ok) && res.data) {
      return { success: true, data: res.data };
    }

    
    const listRes: any = await api("/api/rentals", {
      method: "GET",
      headers,
    });

    const listData = listRes?.data || listRes;
    if (listRes && Array.isArray(listData)) {
      const found = listData.find(
        (r: any) => String(r.id || r._id) === String(requestId)
      );
      if (found) {
        return { success: true, data: found };
      }
    }

    return { success: false, message: "Rental request not found!" };
  } catch (error) {
    console.error("Failed to fetch rental details:", error);
    return { success: false, message: "Something went wrong!" };
  }
}