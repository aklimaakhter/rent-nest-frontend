/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [confirming, setConfirming] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const confirmPaymentOnBackend = async () => {
      if (!sessionId) {
        setConfirming(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/payments/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();

        if (!data.success) {
          setErrorMsg(data.message || "Failed to confirm payment on server.");
        }
      } catch (error) {
        console.error("Payment confirmation error:", error);
        setErrorMsg("Something went wrong while confirming the payment.");
      } finally {
        setConfirming(false);
      }
    };

    confirmPaymentOnBackend();
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] p-6 text-center space-y-6">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl font-bold shadow-sm">
        ✓
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {confirming ? "Confirming Payment..." : "Payment Successful!"}
        </h1>
        
        <p className="text-gray-600 max-w-md">
          {confirming
            ? "Please wait while we verify your transaction and update your rental status."
            : errorMsg 
              ? errorMsg 
              : "Thank you! Your payment has been processed successfully. Your rental request status has been updated."}
        </p>

        {sessionId && (
          <p className="text-xs text-gray-400 font-mono mt-1">
            Session ID: {sessionId.slice(0, 20)}...
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-4 pt-2">
        <Link 
          href="/dashboard/tenant" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition shadow-sm"
        >
          Go to Tenant Dashboard
        </Link>
        <Link 
          href="/properties" 
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium transition"
        >
          Browse More Properties
        </Link>
      </div>
    </div>
  );
}