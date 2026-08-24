/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { api } from "@/lib/api";

export async function fetchRentalDetailsAction(requestId: string) {
  try {
   
    const res: any = await api(`/api/rentals/${requestId}`, {
      method: "GET",
    });

    if (res && (res.success || res.ok) && res.data) {
      return { success: true, data: res.data };
    }

    const listRes: any = await api("/api/rentals", {
      method: "GET",
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