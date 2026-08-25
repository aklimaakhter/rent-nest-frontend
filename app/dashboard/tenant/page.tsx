/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { BASE_URL } from "@/lib/api";
import TenantRequestsClient from "./TenantRequestsClient";


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
      <TenantRequestsClient requests={requests} />
    </div>
  );
}