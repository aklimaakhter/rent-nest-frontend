/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { fetchRentalDetailsAction } from "../../../_actions/rentalActions";
import { createPaymentAction } from "@/app/payment/_actions/paymentActions";

export default function TenantPaymentPage() {
  const params = useParams();
  const requestId = params?.id as string;

  const [requestDetails, setRequestDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, startTransition] = useTransition();

  useEffect(() => {
    if (!requestId) return;

    const loadData = async () => {
      setLoading(true);
      const result = await fetchRentalDetailsAction(requestId);
      if (result.success) {
        setRequestDetails(result.data);
      } else {
        toast.error(result.message);
      }
      setLoading(false);
    };

    loadData();
  }, [requestId]);

  // const handlePayment = async () => {
  //   startTransition(async () => {
  //     try {
  //       const res: any = await api(`/api/payments/create`, {
  //         method: "POST",
  //         body: JSON.stringify({ rentalRequestId: requestId }), 
  //       });

  //       if (res?.success || res?.url || res?.ok) {
  //         const paymentUrl = res.url || res.data?.url;
  //         if (paymentUrl) {
  //           window.location.href = paymentUrl;
  //         } else {
  //           toast.success("Payment initiated successfully!");
  //         }
  //       } else {
  //         toast.error(res?.message || "Failed to initiate payment");
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       toast.error("Something went wrong during payment!");
  //     }
  //   });
  // };

  

  const handlePayment = async () => {
    startTransition(async () => {
      try {
        
        const res: any = await createPaymentAction(requestId);

        if (res?.success || res?.url || res?.data?.url) {
          const paymentUrl = res.url || res.data?.url || res.data?.checkoutUrl; 
          if (paymentUrl) {
            window.location.href = paymentUrl;
          } else {
            toast.success("Payment initiated successfully!");
          }
        } else {
          toast.error(res?.message || "Failed to initiate payment");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong during payment!");
      }
    });
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500 text-xs">Loading payment details...</div>;
  }

  if (!requestDetails) {
    return <div className="text-center py-12 text-red-500 text-xs">Rental request not found or invalid ID.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
      <h1 className="text-lg font-bold text-gray-800">Complete Your Payment</h1>
      
      <div className="space-y-3 text-xs text-gray-600 bg-gray-50 p-4 rounded-xl">
        <p><strong>Property:</strong> {requestDetails?.property?.title || requestDetails?.propertyTitle || "N/A"}</p>
        <p><strong>Location:</strong> {requestDetails?.property?.location || "N/A"}</p>
        <p><strong>Price:</strong> BDT {requestDetails?.property?.price || requestDetails?.price || "N/A"}</p>
        <p><strong>Status:</strong> <span className="uppercase font-semibold text-emerald-600">{requestDetails?.status || "Pending"}</span></p>
      </div>

      <button
        onClick={handlePayment}
        disabled={paying}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 shadow-md"
      >
        {paying ? "Processing Payment..." : "Pay Now"}
      </button>
    </div>
  );
}