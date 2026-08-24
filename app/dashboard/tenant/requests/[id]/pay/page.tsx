/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

export default function TenantPaymentPage() {
  const params = useParams();
  const requestId = params?.id as string;

  const [requestDetails, setRequestDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!requestId) return;

    const fetchRequestDetails = async () => {
      try {
        
        const res: any = await api(`/api/rentals/${requestId}`, {
          method: "GET",
        });

        if (res && (res.success || res.ok) && res.data) {
          setRequestDetails(res.data);
        } else {
          
          const listRes: any = await api("/api/rentals", {
            method: "GET",
          });

          const listData = listRes?.data || listRes;
          if (listRes && Array.isArray(listData)) {
            const found = listData.find(
              (r: any) => String(r.id || r._id) === String(requestId)
            );
            if (found) {
              setRequestDetails(found);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load request details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [requestId]);

  if (loading) {
    return <div className="text-center py-12 text-gray-500 text-xs">Loading payment details...</div>;
  }

  if (!requestDetails) {
    return <div className="text-center py-12 text-red-500 text-xs">Rental request not found!</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
      <h1 className="text-lg font-bold text-gray-800">Complete Your Payment</h1>
      <div className="space-y-2 text-xs text-gray-600">
        <p><strong>Property:</strong> {requestDetails?.property?.title || "N/A"}</p>
        <p><strong>Price:</strong> BDT {requestDetails?.property?.price || "N/A"}</p>
        <p><strong>Status:</strong> {requestDetails?.status || "Pending"}</p>
      </div>
    </div>
  );
}