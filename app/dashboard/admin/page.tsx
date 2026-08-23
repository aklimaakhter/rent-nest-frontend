"use client";

import { useEffect, useState } from "react";
import { getAllUsersAction, toggleUserStatusAction } from "./_action/adminAction";
import { ApiResponse, User } from "@/lib/types";



export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  
  const fetchUsers = async () => {
    setLoading(true);
    const res = (await getAllUsersAction()) as ApiResponse;
    
    if (res) {
      const userList = res.data || res.users || (Array.isArray(res) ? (res as unknown as User[]) : []);
      setUsers(userList);
    }
    setLoading(false);
  };

  
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const res = (await getAllUsersAction()) as ApiResponse;
      
      if (res) {
        const userList = res.data || res.users || (Array.isArray(res) ? (res as unknown as User[]) : []);
        setUsers(userList);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  // ব্যান/আনব্যান হ্যান্ডলার
  const handleToggleStatus = async (userId: string, status: string) => {
    setUpdatingId(userId);
    await toggleUserStatusAction(userId, status);
    await fetchUsers();
    setUpdatingId(null);
  };

  // সার্চ ফিল্টার
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* ১. ড্যাশবোর্ড হেডার */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Moderation Dashboard</h1>
        <p className="text-gray-500">Overview of users, statistics, and platform content.</p>
      </div>

      {/* ২. গ্লোবাল স্ট্যাটিস্টিক্স (Stats Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
          <p className="text-3xl font-bold text-emerald-600 mt-2">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Active Accounts</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {users.filter((u) => u.status === "ACTIVE").length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Banned Accounts</h3>
          <p className="text-3xl font-bold text-rose-600 mt-2">
            {users.filter((u) => u.status !== "ACTIVE").length}
          </p>
        </div>
      </div>

      {/* ৩. ইউজার ম্যানেজমেন্ট টেবিল (User Management Table) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-800">User Management</h2>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg text-sm w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading user management data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-gray-800">{user.name}</td>
                      <td className="p-4 text-gray-600">{user.email}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-700"
                              : user.role === "LANDLORD"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            user.status === "ACTIVE"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {user.status || "ACTIVE"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {user.role !== "ADMIN" && (
                          <button
                            onClick={() => handleToggleStatus(user.id, user.status || "ACTIVE")}
                            disabled={updatingId === user.id}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                              user.status === "ACTIVE"
                                ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            }`}
                          >
                            {updatingId === user.id
                              ? "Updating..."
                              : user.status === "ACTIVE"
                              ? "Ban User"
                              : "Unban User"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-400">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}