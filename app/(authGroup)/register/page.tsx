/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';

const ROUTES: Record<string, string> = {
  TENANT: '/dashboard/tenant',
  LANDLORD: '/dashboard/landlord',
  ADMIN: '/dashboard/admin',
};

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'TENANT' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {

      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });


     
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || `Registration failed (${res.status})`);
      }

      const payload = data?.data;
      if (!payload?.token) throw new Error('No token received from server');

      const userRole = payload.role || formData.role;


      Cookies.set('token', payload.token, { expires: 7, path: '/' });
      Cookies.set('role', userRole, { expires: 7, path: '/' });

      window.location.href = ROUTES[userRole] || '/dashboard/tenant';
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-4">
      <div className="w-full max-w-[440px] border border-gray-100 shadow-md rounded-2xl bg-white p-6">
        <div className="text-center pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Create RentNest Account</h1>
          <p className="text-xs text-gray-500 mt-1">Join as a Tenant or Landlord</p>
        </div>

        {error && <div className="mb-4 bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-xs text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700">Full Name</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full h-11 px-3 mt-1 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">Email Address</label>
            <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full h-11 px-3 mt-1 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">Password</label>
            <input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full h-11 px-3 mt-1 rounded-xl border border-gray-200 text-sm focus:border-emerald-600 outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700">I want to join as a:</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setFormData({ ...formData, role: 'TENANT' })} className={`h-11 rounded-xl font-medium text-xs transition ${formData.role === 'TENANT' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                Tenant
              </button>
              <button type="button" onClick={() => setFormData({ ...formData, role: 'LANDLORD' })} className={`h-11 rounded-xl font-medium text-xs transition ${formData.role === 'LANDLORD' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                Landlord
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full h-11 bg-emerald-600 text-white rounded-xl font-medium text-sm transition disabled:opacity-50">
            {loading ? 'Processing...' : 'Register'}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-emerald-600">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}