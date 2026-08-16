"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";

const ROLE_ROUTES: Record<string, string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
};

export default function Navbar() {
  const pathname = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const token = Cookies.get("accessToken") || Cookies.get("token");
    const role = Cookies.get("role") || "";

    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
    } else {
      setIsLoggedIn(false);
      setUserRole("");
    }
  }, [pathname]);

  const handleLogout = () => {
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("token", { path: "/" });
    Cookies.remove("role", { path: "/" });
    setIsLoggedIn(false);
    setUserRole("");
    window.location.href = "/auth/login";
  };

  const dashboardPath = ROLE_ROUTES[userRole] || "/dashboard/tenant";

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-emerald-600">RentNest</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-emerald-600 transition">
            Home
          </Link>
          <Link href="/properties" className="hover:text-emerald-600 transition">
            Properties
          </Link>
          {isLoggedIn && (
            <Link
              href={dashboardPath}
              className={`hover:text-emerald-600 transition ${
                pathname.startsWith("/dashboard") ? "text-emerald-600 font-semibold" : ""
              }`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
                {userRole || "USER"}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-2 text-xs font-semibold text-gray-700 hover:text-emerald-600 transition"
              >
                Log in
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition shadow-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}