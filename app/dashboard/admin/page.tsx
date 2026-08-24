/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { 
  getAllUsersAction, 
  toggleUserStatusAction, 
  getAllPropertiesAction, 
  getAllRentalsAction 
} from "./_action/adminAction";
import { User } from "@/lib/types";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"users" | "properties" | "rentals">("users");

  const [users, setUsers] = useState<User[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  useEffect(() => {
    async function fetchAdminData() {
      setLoading(true);
      try {
        const userRes: any = await getAllUsersAction();
        setUsers(userRes?.data || userRes?.users || (Array.isArray(userRes) ? userRes : []));

        const propRes: any = await getAllPropertiesAction();
        setProperties(propRes?.data || propRes?.properties || (Array.isArray(propRes) ? propRes : []));

        const rentalRes: any = await getAllRentalsAction();
        setRentals(rentalRes?.data || rentalRes?.rentals || (Array.isArray(rentalRes) ? rentalRes : []));
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAdminData();
  }, []);

  const handleToggleStatus = async (userId: string, status: string) => {
    setUpdatingId(userId);
    try {
      await toggleUserStatusAction(userId, status);
      const res: any = await getAllUsersAction();
      setUsers(res?.data || res?.users || (Array.isArray(res) ? res : []));
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setUpdatingId(null);
    }
  };

  
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "ACTIVE" || !u.status).length;
  const bannedUsers = users.filter((u) => u.status && u.status !== "ACTIVE").length;
  const totalProperties = properties.length;
  const totalRentals = rentals.length;

  
  const filteredUsers = users.filter(
    (user) =>
      user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Moderation Dashboard</h1>
        <p className="text-gray-500">Overview of users, properties, rentals, and platform content.</p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-xs font-medium uppercase">Total Users</h3>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{totalUsers}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-xs font-medium uppercase">Active Users</h3>
          <p className="text-2xl font-bold text-blue-600 mt-1">{activeUsers}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-xs font-medium uppercase">Banned Users</h3>
          <p className="text-2xl font-bold text-rose-600 mt-1">{bannedUsers}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-xs font-medium uppercase">Total Properties</h3>
          <p className="text-2xl font-bold text-purple-600 mt-1">{totalProperties}</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-xs font-medium uppercase">Rental Requests</h3>
          <p className="text-2xl font-bold text-amber-600 mt-1">{totalRentals}</p>
        </div>
      </div>

      
      <div className="flex border-b border-gray-200 space-x-6">
        <button
          onClick={() => { setActiveTab("users"); setCurrentPage(1); }}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${
            activeTab === "users"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          User Management ({totalUsers})
        </button>
        <button
          onClick={() => setActiveTab("properties")}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${
            activeTab === "properties"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Property Moderation ({totalProperties})
        </button>
        <button
          onClick={() => setActiveTab("rentals")}
          className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${
            activeTab === "rentals"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Rental Requests ({totalRentals})
        </button>
      </div>

      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading platform data...</div>
        ) : (
          <>
            
            {activeTab === "users" && (
              <div>
                <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-xl font-bold text-gray-800">All Users</h2>
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); 
                    }}
                    className="px-4 py-2 border rounded-lg text-sm w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
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
                      {currentUsers.length > 0 ? (
                        currentUsers.map((user) => (
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

                
                {totalPages > 1 && (
                  <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50 text-sm">
                    <span className="text-gray-500">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 border rounded-md bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-100"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1 font-medium text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 border rounded-md bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-100"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            
            {activeTab === "properties" && (
              <div>
                <div className="p-5 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800">All Properties</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600 font-semibold border-b">
                      <tr>
                        <th className="p-4">Title / Location</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Bedrooms</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {properties.length > 0 ? (
                        properties.map((property) => (
                          <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-medium text-gray-800">
                              {property.title || property.name || "N/A"}
                              <span className="block text-xs text-gray-400">{property.location || property.address}</span>
                            </td>
                            <td className="p-4 text-gray-600">${property.price || property.rentAmount || "N/A"}</td>
                            <td className="p-4 text-gray-600">{property.bedrooms || "N/A"}</td>
                            <td className="p-4">
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                {property.status || "AVAILABLE"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-6 text-center text-gray-400">
                            No properties found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            
            {activeTab === "rentals" && (
              <div>
                <div className="p-5 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800">All Rental Requests</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600 font-semibold border-b">
                      <tr>
                        <th className="p-4">Tenant</th>
                        <th className="p-4">Property</th>
                        <th className="p-4">Request Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {rentals.length > 0 ? (
                        rentals.map((rental) => (
                          <tr key={rental.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-medium text-gray-800">{rental.user?.name || rental.tenantName || "N/A"}</td>
                            <td className="p-4 text-gray-600">{rental.property?.title || rental.propertyTitle || "N/A"}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                rental.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                              }`}>
                                {rental.status || "PENDING"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="p-6 text-center text-gray-400">
                            No rental requests found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}