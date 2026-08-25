/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, use } from "react";
import { api } from "@/lib/api";
import RequestRentButton from "../_component/requestRentButton";
import Link from "next/link";

interface PropertyDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function PropertyDetailsPage({ params }: PropertyDetailsPageProps) {
  const { id } = use(params);

  const [property, setProperty] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res: any = await api(`/api/properties/${id}`, {
          method: "GET",
          cache: "no-store",
        });
        setProperty(res?.data || res?.property || res);
      } catch (err) {
        console.error("Property fetch error:", err);
      }

      try {
        const userRes: any = await api(`/api/auth/me`, {
          method: "GET",
          cache: "no-store",
        });
        setCurrentUser(userRes?.data || userRes);
      } catch (err) {
        console.log("User not logged in");
      }

      try {
        const reviewsRes: any = await api(`/api/reviews/${id}`, {
          method: "GET",
          cache: "no-store",
        });
        
        // পোস্টম্যানের রেসপন্স অনুযায়ী ডেটা অ্যারে ধরার সঠিক পদ্ধতি
        if (reviewsRes?.success && Array.isArray(reviewsRes?.data)) {
          setReviews(reviewsRes.data);
        } else if (Array.isArray(reviewsRes)) {
          setReviews(reviewsRes);
        } else if (Array.isArray(reviewsRes?.data)) {
          setReviews(reviewsRes.data);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.log("Reviews fetch error");
        setReviews([]);
      }

      setLoading(false);
    }

    if (id) {
      loadData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 text-sm">Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-red-600">Property not found!</h2>
        <p className="text-xs text-gray-500">The property ID might be incorrect or the property was deleted.</p>
        <div>
          <Link href="/properties" className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const isLandlord = currentUser?.role === "LANDLORD";
  const isOwner = property?.landlordId === currentUser?.id || property?.landlord === currentUser?.id;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Property Image */}
      <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-md">
        <img 
          src={property?.image || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"} 
          alt={property?.title || "Property"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Property Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">{property?.title}</h1>
            <p className="text-gray-600 text-sm">{property?.location}</p>
            <div className="text-xl font-semibold text-emerald-600">
              ৳ {property?.price} <span className="text-xs text-gray-500">/ month</span>
            </div>
            <hr className="border-gray-100" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{property?.description}</p>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Reviews ({Array.isArray(reviews) ? reviews.length : 0})</h3>
            
            {!Array.isArray(reviews) || reviews.length === 0 ? (
              <p className="text-xs text-gray-500">No reviews yet for this property.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev: any, index: number) => (
                  <div key={rev?.id || rev?._id || index} className="border-b border-gray-100 pb-4 last:border-none last:pb-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-sm text-gray-800">
                        {rev?.tenant?.name || "Tenant"}
                      </span>
                      <span className="text-amber-500 text-sm font-bold">
                        ⭐ {rev?.rating || 0} / 5
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{rev?.comment}</p>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {rev?.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Request CTA Box */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4 h-fit">
          <h3 className="font-bold text-gray-800 text-lg">Interested in this property?</h3>
          
          {isLandlord || isOwner ? (
            <div className="space-y-3">
              <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                You are logged in as a Landlord. You cannot send a rental request to this property.
              </p>
              <Link
                href="/dashboard/landlord/requests"
                className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-xl transition"
              >
                View Rental Requests
              </Link>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-500">Submit a rental request to the landlord to get started.</p>
              <RequestRentButton propertyId={property.id || property._id} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}