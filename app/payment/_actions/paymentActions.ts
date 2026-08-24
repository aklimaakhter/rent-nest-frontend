/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

"use server";

import { api } from "@/lib/api";
import { cookies } from "next/headers";

export async function createPaymentAction(rentalRequestId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || cookieStore.get("accessToken")?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res: any = await api(`/api/payments/create`, {
      method: "POST",
      headers,
      body: JSON.stringify({ rentalRequestId }),
    });

    return res;
  } catch (error) {
    console.error("Payment creation error:", error);
    return { success: false, message: "Something went wrong!" };
  }
}