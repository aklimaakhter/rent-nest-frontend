/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/api";
import Link from "next/link";

export default async function PropertiesPage() {
  let properties = [];

  try {
    const res: any = await api("/api/properties", {
      method: "GET",
      cache: "no-store",
    });
    properties = Array.isArray(res) ? res : res?.data || res?.properties || [];
  } catch (error) {
    console.error("Failed to fetch properties", error);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Available Properties</h1>
        <p className="text-sm text-gray-500">Total: {properties.length}</p>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-gray-500 text-sm">No properties found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {properties.map((property: any) => (
            <Link 
              href={`/properties/${property.id || property._id}`} 
              key={property.id || property._id}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group"
            >
              <div className="h-48 w-full relative overflow-hidden bg-gray-100">
                <img 
                  src={property?.image || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"} 
                  alt={property?.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-bold text-gray-800 text-base line-clamp-1">{property?.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-1">{property?.location}</p>
                <div className="text-emerald-600 font-semibold text-sm pt-2">
                  ৳ {property?.price} <span className="text-xs text-gray-400">/ month</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}