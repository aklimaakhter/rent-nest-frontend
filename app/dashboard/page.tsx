"use client";

import { useState } from "react";

export default function TenantDashboard() {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  
  const handlePayNow = async (requestId: string) => {
    try {
      setLoadingId(requestId);
      
      const res = await fetch("http://localhost:5000/api/payments/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({ requestId }),
      });

      const data = await res.json();

      
      if (data.success && (data.url || data.paymentUrl || data.data?.url)) {
        const checkoutUrl = data.url || data.paymentUrl || data.data?.url;
        window.location.href = checkoutUrl;
      } else {
        alert(data.message || "Failed to create Stripe checkout session.");
      }
    } catch (error) {
      console.error("Stripe payment error:", error);
      alert("Something went wrong with the payment process.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    // <button onClick={() => handlePayNow(req.id || req._id)}>
    //   {loadingId === (req.id || req._id) ? "Redirecting..." : "Pay Now"}
    // </button>
    null
  );
}