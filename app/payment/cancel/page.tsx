/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] p-6 text-center space-y-6">
      <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl font-bold shadow-sm">
        ✕
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900">Payment Cancelled</h1>
        <p className="text-gray-600 max-w-md">
          Your payment process was cancelled or interrupted. No charges were made to your account. You can try again whenever you are ready.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 pt-2">
        <Link 
          href="/dashboard/tenant" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition shadow-sm"
        >
          Go to Tenant Dashboard
        </Link>
        <Link 
          href="/properties" 
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-medium transition"
        >
          Browse Properties
        </Link>
      </div>
    </div>
  );
}