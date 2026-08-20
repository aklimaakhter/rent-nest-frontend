/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, DollarSign } from "lucide-react";
import { toast } from "sonner";

export default function LandlordDashboard() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandlordProperties = async () => {
      try {
        const res = await api("/api/landlord/properties", { method: "GET" });
        if (res) {
          setProperties(Array.isArray(res) ? res : res.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch properties", err);
        toast.error("Failed to load your properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchLandlordProperties();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Landlord Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your property listings and monitor rental status.
          </p>
        </div>
        <Link href="/dashboard/landlord/properties/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add New Property
          </Button>
        </Link>
      </div>

      {/* Listed Properties Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Your Listed Properties</h2>

        {loading ? (
          <div className="text-center py-12 text-xs text-gray-400">Loading properties...</div>
        ) : properties.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center space-y-3">
            <p className="text-xs text-gray-500">
              No properties found. Click &quot;+ Add New Property&quot; to list your first rental.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property.id || property._id} className="overflow-hidden border border-gray-100 shadow-sm rounded-2xl flex flex-col justify-between">
                <div>
                  {/* Property Image */}
                  <div className="relative h-48 w-full bg-gray-100">
                    <img
                      src={property.image || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow">
                      {property.isAvailable !== false ? "Available" : "Rented"}
                    </span>
                  </div>

                  <CardHeader className="p-4 pb-2">
                    <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{property.title}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" /> {property.location}
                    </p>
                  </CardHeader>

                  <CardContent className="p-4 pt-0">
                    <p className="text-xs text-gray-600 line-clamp-2 mt-2">{property.description}</p>
                    <div className="mt-3 flex items-center text-emerald-600 font-bold text-sm">
                      <DollarSign className="w-4 h-4" /> {property.price} / month
                    </div>
                  </CardContent>
                </div>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Link href={`/dashboard/landlord/properties/edit/${property.id || property._id}`} className="w-1/2">
                    <Button variant="outline" className="w-full text-xs rounded-xl">
                      Edit
                    </Button>
                  </Link>

                  <Button
                    variant="destructive"
                    className="w-1/2 text-xs rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 shadow-none"
                    onClick={async () => {
                      if (confirm("Are you sure you want to delete this property?")) {
                        try {
                          const propertyId = property.id || property._id;
                          const res = await api(`/api/landlord/properties/${propertyId}`, { method: "DELETE" });
                          if (res) {
                            toast.success("Property deleted successfully!");
                            
                            setProperties(properties.filter(p => (p.id || p._id) !== propertyId));
                          } else {
                            toast.error("Failed to delete property.");
                          }
                        } catch (err) {
                          console.error("Delete failed", err);
                          toast.error("Something went wrong.");
                        }
                      }
                    }}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}