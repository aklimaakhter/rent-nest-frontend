/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { api } from "@/lib/api";
import { cookies } from "next/headers";

export async function createReviewAction(data: { propertyId: string; rating: number; comment: string }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || cookieStore.get("accessToken")?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res: any = await api(`/api/reviews`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    return res;
  } catch (error) {
    console.error("Review submission error:", error);
    return { success: false, message: "Something went wrong while submitting review!" };
  }
}