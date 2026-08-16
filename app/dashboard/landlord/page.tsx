/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Property {
  _id: string;
  title: string;
  location: string;
  price: number;
  category: string;
  images: string[];
}

export default function LandlordDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false);

  const getCookie = (name: string): string => {
    if (typeof document === "undefined") return "";
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || "";
    return "";
  };

  const fetchLandlordProperties = async () => {
    setLoading(true);
    setError("");
    const token = getCookie("accessToken") || getCookie("token");

    if (!token) {
      setError("Unauthorized access. Please login.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/landlord/properties`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch properties.");
      }

      setProperties(data.properties || data || []);
      setFetched(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    const token = getCookie("accessToken") || getCookie("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/landlord/properties/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete property");

      setProperties(properties.filter((item) => item._id !== id));
    } catch (err: any) {
      alert(err.message || "Error deleting property");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Landlord Dashboard</h1>
          <p className="text-gray-500 text-xs mt-1">
            Manage your property listings and monitor rental status.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/landlord/requests"
            className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200 transition"
          >
            Manage Requests
          </Link>
          <Link
            href="/dashboard/landlord/properties/new"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition shadow-sm"
          >
            + Add New Property
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-xs">
          {error}
        </div>
      )}

      {/* Property List Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Your Listed Properties</h2>
          {!fetched && !loading && (
            <button
              onClick={fetchLandlordProperties}
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl shadow-sm hover:bg-emerald-700 transition"
            >
              Load My Properties
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : !fetched ? (
          <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-3">
            <p className="text-gray-500 text-sm">Click the button above to load your properties.</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-3">
            <p className="text-gray-500 text-sm">You have not added any properties yet.</p>
            <Link
              href="/dashboard/landlord/properties/new"
              className="inline-block px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl"
            >
              Create First Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition"
              >
                <div>
                  <div className="relative h-44 w-full bg-gray-100">
                    <Image
                      src={item.images?.[0] || "https://via.placeholder.com/400x250?text=Property"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {item.category || "Apartment"}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-gray-900 truncate">{item.title}</h3>
                    <p className="text-gray-500 text-xs truncate"> {item.location}</p>
                    <p className="text-emerald-600 font-extrabold text-base">
                      ${item.price} <span className="text-gray-400 text-xs font-normal">/ month</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50/50">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-lg transition"
                  >
                    Delete
                  </button>
                  <Link
                    href={`/properties/${item._id}`}
                    className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}