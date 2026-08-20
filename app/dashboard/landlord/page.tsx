/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { toast } from "sonner";

export default function LandlordDashboard() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  //useEffect এর ঝামেলা এড়াতে ফাংশনটি সরাসরি useEffect এর ভেতরেই ডিফাইন করে কল করা সবচেয়ে নিরাপদ
  useEffect(() => {
    let isMounted = true;

    const fetchMyProperties = async () => {
      try {
        setLoading(true);
        const res = await api("/api/landlord/properties", { method: "GET" });
        console.log("Landlord Properties Response:", res);

        if (isMounted && res && res.success) {
          setProperties(Array.isArray(res.data) ? res.data : []);
        } else if (isMounted) {
          setProperties([]);
        }
      } catch (err) {
        console.error("Failed to fetch properties", err);
        if (isMounted) toast.error("Failed to load your properties");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMyProperties();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Landlord Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your property listings and monitor rental status.
          </p>
        </div>
        <div>
          <Link
            href="/dashboard/landlord/properties/new"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition"
          >
            + Add New Property
          </Link>
        </div>
      </div>

      {/* Listed Properties Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Your Listed Properties</h2>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400 text-xs">Loading properties...</div>
        ) : properties.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-400 text-xs shadow-sm">
            No properties found. Click + Add New Property to list your first rental.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop: any) => (
              <div
                key={prop.id || prop._id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
              >
                <div className="relative h-48 w-full bg-gray-100">
                  <img
                    src={prop.image || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"}
                    alt={prop.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex flex-col flex-grow space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{prop.title}</h3>
                    <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-lg">
                      ${prop.price}/mo
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{prop.location}</p>
                  <p className="text-xs text-gray-600 line-clamp-2 mt-1">{prop.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}