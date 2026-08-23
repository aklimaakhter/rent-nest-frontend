import Link from "next/link";
import { getMe } from "@/service/getMe";

export default async function LandlordDashboardPage() {
  const user = await getMe();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Welcome Section */}
      <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.name || "Landlord"}! 👋</h1>
          <p className="text-emerald-100 text-sm mt-1">Manage your properties and tenant requests efficiently.</p>
        </div>
        <Link
          href="/dashboard/landlord/requests"
          className="bg-white text-emerald-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition shadow-sm text-sm"
        >
          View Rental Requests →
        </Link>
      </div>

      {/* Quick Stats or Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-2">
          <p className="text-sm text-gray-500 font-medium">Role</p>
          <h3 className="text-xl font-bold text-gray-900 uppercase">{user?.role || "LANDLORD"}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-2">
          <p className="text-sm text-gray-500 font-medium">Email</p>
          <h3 className="text-lg font-semibold text-gray-900">{user?.email}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-2">
          <p className="text-sm text-gray-500 font-medium">Account Status</p>
          <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}