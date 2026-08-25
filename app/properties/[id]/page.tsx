/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { api } from "@/lib/api";
import { cookies } from "next/headers";
import RequestRentButton from "../_component/requestRentButton";
import Link from "next/link";

interface PropertyDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailsPage({ params }: PropertyDetailsPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;

  let property: any = null;
  let currentUser: any = null;
  let reviews: any[] = [];

  // ১. প্রপার্টি ফেচ করার নিরাপদ চেষ্টা
  try {
    if (id) {
      const res: any = await api(`/api/properties/${id}`, {
        method: "GET",
        cache: "no-store",
      });
      property = res?.data || res?.property || res;
    }
  } catch (error) {
    console.error("Failed to fetch property details", error);
  }

  // প্রপার্টি না থাকলে ক্র্যাশ না করিয়ে সুন্দর একটি মেসেজ দেখাবে
  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-red-600">Property not found or invalid ID!</h2>
        <p className="text-xs text-gray-500">The property you are looking for might have been removed or does not exist.</p>
        <div>
          <Link href="/properties" className="inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition">
            Browse All Properties
          </Link>
        </div>
      </div>
    );
  }

  // ২. ইউজার ইনফো ফেচ
  try {
    if (token) {
      const userRes: any = await api(`/api/auth/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      currentUser = userRes?.data || userRes;
    }
  } catch (error) {
    console.log("User info not loaded");
  }

  // ৩. রিভিউ ফেচ
  try {
    const reviewsRes: any = await api(`/api/reviews/${id}`, {
      method: "GET",
      cache: "no-store",
    });
    reviews = reviewsRes?.data || reviewsRes || [];
  } catch (error) {
    console.log("Reviews not available");
  }

  const isLandlord = currentUser?.role === "LANDLORD";
  const isOwner = property?.landlordId === currentUser?.id || property?.landlord === currentUser?.id;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Property Image */}
      <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-md">
        <img 
          src={property?.image || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"} 
          alt={property?.title || "Property Image"}
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
            <h3 className="text-lg font-bold text-gray-800">Reviews ({reviews.length})</h3>
            
            {reviews.length === 0 ? (
              <p className="text-xs text-gray-500">No reviews yet for this property.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev: any, index: number) => (
                  <div key={rev.id || rev._id || index} className="border-b border-gray-100 pb-4 last:border-none last:pb-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-sm text-gray-800">
                        {rev?.tenant?.name || "Tenant"}
                      </span>
                      <span className="text-amber-500 text-sm font-bold">
                        ⭐ {rev.rating} / 5
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{rev.comment}</p>
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