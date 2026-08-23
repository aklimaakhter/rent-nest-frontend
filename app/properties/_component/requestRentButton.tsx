/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTransition } from "react";
import { toast } from "sonner";

export default function RequestRentButton({ propertyId, token }: { propertyId: string; token?: string }) {
  const [isPending, startTransition] = useTransition();

  const handleRequest = async () => {
    if (!token) {
      toast.error("Please login as a tenant to send a request!");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("http://localhost:5000/api/rentals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ propertyId }),
        });

        const result = await response.json();

        if (!response.ok || result.success === false) {
          toast.error(result.message || "Failed to submit request");
        } else {
          toast.success("Rental request sent successfully!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong!");
      }
    });
  };

  return (
    <button
      onClick={handleRequest}
      disabled={isPending}
      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 shadow-md"
    >
      {isPending ? "Submitting..." : "Request to Rent"}
    </button>
  );
}