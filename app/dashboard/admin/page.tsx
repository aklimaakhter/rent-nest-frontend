"use client";

import { useEffect, useState } from "react";
import { getAllUsersAction, toggleUserStatusAction } from "./_action/adminAction";
import { User } from "@/lib/types";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // ফাংশনটি সরাসরি useEffect এর ভেতরে ডিক্লেয়ার করা হলো, ফলে কোনো ডিপেন্ডেন্সি এরর হবে না
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const res: any = await getAllUsersAction();
        const userList = res?.data || res?.users || (Array.isArray(res) ? res : []);
        setUsers(userList);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId: string, status: string) => {
    setUpdatingId(userId);
    try {
      await toggleUserStatusAction(userId, status);
      
      // স্ট্যাটাস পরিবর্তনের পর ইউজার লিস্ট আবার ফেচ করার জন্য
      const res: any = await getAllUsersAction();
      const userList = res?.data || res?.users || (Array.isArray(res) ? res : []);
      setUsers(userList);
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "ACTIVE" || !u.status).length;
  const bannedUsers = users.filter((u) => u.status && u.status !== "ACTIVE").length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Moderation Dashboard</h1>
        <p className="text-gray-500">Overview of users, statistics, and platform content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
          <p className="text-3xl font-bold text-emerald-600 mt-2">{totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Active Accounts</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{activeUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Banned Accounts</h3>
          <p className="text-3xl font-bold text-rose-600 mt-2">{bannedUsers}</p>
        </div>
      </div>

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
          <div className="p-8 text-center text-gray-500">Loading users...</div>
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
                      <td className="p-4 font-medium text-gray-800">{user.name || "N/A"}</td>
                      <td className="p-4 text-gray-600">{user.email}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          (user.status === "ACTIVE" || !user.status) ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                        }`}>
                          {user.status || "ACTIVE"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {user.role !== "ADMIN" && (
                          <button
                            onClick={() => handleToggleStatus(user.id, user.status || "ACTIVE")}
                            disabled={updatingId === user.id}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                              user.status === "ACTIVE" || !user.status
                                ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            }`}
                          >
                            {updatingId === user.id ? "Updating..." : (user.status === "ACTIVE" || !user.status) ? "Ban User" : "Unban User"}
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