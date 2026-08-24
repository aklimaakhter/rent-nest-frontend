/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { BASE_URL } from "@/lib/api";

export default async function TenantDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;

  let requests = [];

  try {
    const res = await fetch(`${BASE_URL}/api/rentals`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    const data = await res.json();
    requests = Array.isArray(data) ? data : data?.data || [];
  } catch (error) {
    console.error("Failed to fetch rental requests", error);
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Tenant Dashboard - My Requests</h1>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden p-6">
        {requests.length === 0 ? (
          <p className="text-gray-500 text-xs text-center py-8">No rental requests found.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((req: any) => (
              <div key={req.id || req._id} className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-800">{req?.property?.title || "Property Rental"}</h4>
                  <p className="text-xs text-gray-500">Location: {req?.property?.location}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase ${
                    req.status === 'APPROVED' ? 'bg-blue-100 text-blue-700' :
                    req.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                    req.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {req.status}
                  </span>
                  {req.status === 'APPROVED' && (
                    <a 
                      href={`/dashboard/tenant/requests/${req.id || req._id}/pay`}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700"
                    >
                      Pay Now
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}