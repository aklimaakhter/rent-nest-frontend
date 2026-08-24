/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { api } from "@/lib/api";

export async function confirmPaymentAction(sessionId: string) {
  try {
    const res: any = await api("/api/payments/confirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ sessionId }),
    });

    const data = res?.data || res;

    if (res && (res.success || res.ok)) {
      return { success: true };
    } else {
      return { 
        success: false, 
        message: data?.message || "Failed to confirm payment on server." 
      };
    }
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return { 
      success: false, 
      message: "Something went wrong while confirming the payment." 
    };
  }
}