/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function TenantPaymentPage() {
  const params = useParams();
  const requestId = params?.id as string;
  
  const [requestDetails, setRequestDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        // ১. প্রথমে সরাসরি একক রিকোয়েস্ট আনার এপিআই চেষ্টা করা (GET /api/rentals/:id)
        const res = await fetch(`http://localhost:5000/api/rentals/${requestId}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (data.success && data.data) {
          setRequestDetails(data.data);
        } else {
          // ২. যদি একক এপিআই কাজ না করে, তবে সব রিকোয়েস্টের লিস্ট এনে ফিল্টার করা (GET /api/rentals)
          const listRes = await fetch("http://localhost:5000/api/rentals", {
            credentials: "include",
          });
          const listData = await listRes.json();
          
          if (listData.success && Array.isArray(listData.data)) {
            const found = listData.data.find(
              (r: any) => String(r.id || r._id) === String(requestId)
            );
            if (found) {
              setRequestDetails(found);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load request details", error);
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchRequestDetails();
    }
  }, [requestId]);

 const handleStripeCheckout = async () => {
    try {
      setPaying(true);
      const res = await fetch("http://localhost:5000/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ rentalRequestId: requestId }),
      });

      const result = await res.json();
      console.log("Full Payment API Response JSON:", JSON.stringify(result, null, 2));

      // সঠিক পাথ থেকে চেকআউট ইউআরএল বের করা
      const checkoutUrl = result.data?.checkoutUrl || result.url || result.data?.url;

      if (result.success && checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        alert(result.message || "Failed to create Stripe checkout session.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong with the payment process.");
    } finally {
      setPaying(false);
    }
  };
  if (loading) {
    return <p className="p-6 text-center text-gray-600">Loading payment details...</p>;
  }

  if (!requestDetails) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center space-y-4 mt-10">
        <p className="text-red-500 font-medium">Rental request not found or invalid ID.</p>
        <p className="text-xs text-gray-400">Request ID: {requestId}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6 bg-white border rounded-2xl shadow-sm mt-10">
      <h1 className="text-2xl font-bold text-gray-900">Complete Rental Payment</h1>
      
      <div className="space-y-3 text-sm text-gray-700 border-t border-b py-4">
        <p><strong>Property:</strong> {requestDetails.property?.title || requestDetails.propertyTitle}</p>
        <p><strong>Location:</strong> {requestDetails.property?.location || requestDetails.location}</p>
        <p><strong>Monthly Rent:</strong> ${requestDetails.property?.price || requestDetails.price}</p>
        <p><strong>Status:</strong> <span className="text-emerald-600 font-semibold">{requestDetails.status}</span></p>
      </div>

      <button
        onClick={handleStripeCheckout}
        disabled={paying}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 font-medium transition shadow-sm disabled:opacity-50"
      >
        {paying ? "Redirecting to Stripe..." : "Pay Securely with Stripe"}
      </button>
    </div>
  );
}