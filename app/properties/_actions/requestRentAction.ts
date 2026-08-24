/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { api } from "@/lib/api";
import { cookies } from "next/headers";

export async function requestRentAction(propertyId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  try {
    const res = await api("/api/rentals", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ propertyId }),
    });
    return res;
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong!" };
  }
}