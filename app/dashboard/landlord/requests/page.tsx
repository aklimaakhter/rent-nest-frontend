"use client";

import { TenantRequest } from "@/lib/types";
import { useEffect, useState } from "react";




export default function LandlordRequestsPage() {
  const [requests, setRequests] = useState<TenantRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch("http://localhost:5000/api/rentals/landlord/requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setRequests(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch landlord requests", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: "APPROVED" | "REJECTED") => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`http://localhost:5000/api/rentals/landlord/requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`Request ${newStatus.toLowerCase()} successfully!`);
        // ডেটা আপডেট হওয়ার পর পেজ রিফ্রেশ করতে পারেন
        window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Status update error", error);
    }
  };

  if (loading) {
    return <p className="p-6">Loading requests...</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Rental Requests for My Properties</h1>

      {requests.length === 0 ? (
        <p className="text-gray-500">No rental requests received yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="border p-5 rounded-xl shadow-sm bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{req.property.title}</h3>
                <p className="text-sm text-gray-600">Tenant: <span className="font-semibold">{req.tenant.name}</span> ({req.tenant.email})</p>
                <p className="text-xs text-gray-500">Location: {req.property.location}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  req.status === "APPROVED" ? "bg-green-100 text-green-700" :
                  req.status === "REJECTED" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {req.status}
                </span>

                {req.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(req.id, "APPROVED")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-lg font-medium transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(req.id, "REJECTED")}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-lg font-medium transition"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}