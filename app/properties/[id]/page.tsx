/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/api";
import { cookies } from "next/headers";
import RequestRentButton from "../_component/requestRentButton";


interface PropertyDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailsPage({ params }: PropertyDetailsPageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;

  let property: any = null;

  try {
    const res: any = await api(`/api/properties/${id}`, {
      method: "GET",
      cache: "no-store",
    });
    property = res?.data || res?.property || res;
  } catch (error) {
    console.error("Failed to fetch property details", error);
  }

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-red-600">Property not found!</h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Property Image */}
      <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-md">
        <img 
          src={property?.image || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"} 
          alt={property?.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Property Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
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

        {/* Request CTA Box */}
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-4 h-fit">
          <h3 className="font-bold text-gray-800 text-lg">Interested in this property?</h3>
          <p className="text-xs text-gray-500">Submit a rental request to the landlord to get started.</p>
          <RequestRentButton propertyId={property.id || property._id} token={token} />
        </div>
      </div>
    </div>
  );
}