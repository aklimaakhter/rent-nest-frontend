/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { api } from "@/lib/api";
import { cookies } from "next/headers";

export async function getLandlordRequests() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  try {
    const res = await api("/api/rentals/landlord/requests", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.error("Failed to fetch requests", error);
    return { success: false, data: [] };
  }
}

export async function updateRequestStatusAction(id: string, newStatus: "APPROVED" | "REJECTED") {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  try {
    const res = await api(`/api/rentals/landlord/requests/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    return res;
  } catch (error) {
    console.error("Status update error", error);
    return { success: false, message: "Something went wrong" };
  }
}