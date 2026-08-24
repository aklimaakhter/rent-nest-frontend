"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface NavbarClientProps {
  token?: string;
  role?: string;
  logoutAction: () => Promise<void>;
}

export default function NavbarClient({ token, role, logoutAction }: NavbarClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // রোল অনুযায়ী ড্যাশবোর্ড পাথ নির্ধারণ
  let dashboardHref = "/dashboard/landlord";
  if (role === "TENANT") dashboardHref = "/dashboard/tenant";
  else if (role === "ADMIN") dashboardHref = "/dashboard/admin";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Properties", href: "/properties" },
  ];

  if (role) {
    navLinks.push({
      name: `${role.charAt(0) + role.slice(1).toLowerCase()} Dashboard`,
      href: dashboardHref,
    });
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50 w-full shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Brand Name */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="RentNest Logo"
              width={200}
              height={200}
              className="object-contain w-auto h-auto"
              priority
            />
          </div>
          <span className="text-lg sm:text-xl font-bold text-emerald-600">RentNest</span>
        </Link>

        {/* Desktop Nav Links (Active link indicator সহ) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`py-1 transition-colors ${
                  isActive
                    ? "text-emerald-600 font-semibold border-b-2 border-emerald-600"
                    : "hover:text-emerald-600"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth & Role Section */}
        <div className="hidden md:flex items-center gap-3">
          {token ? (
            <div className="flex items-center gap-3">
              {role && (
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                  {role}
                </span>
              )}
              <form action={logoutAction}>
                <Button
                  variant="outline"
                  type="submit"
                  className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 h-9 px-4 text-sm font-medium"
                >
                  Sign Out
                </Button>
              </form>
            </div>
          ) : (
            <Link href="/auth/login">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-4 text-sm font-medium">
                Log In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-600 hover:text-emerald-600 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-5 space-y-3 shadow-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? "bg-emerald-50 text-emerald-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-3">
            {token ? (
              <>
                {role && (
                  <div className="px-3">
                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                      Role: {role}
                    </span>
                  </div>
                )}
                <form action={logoutAction}>
                  <Button
                    variant="outline"
                    type="submit"
                    className="w-full border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 h-9 text-sm font-medium"
                  >
                    Sign Out
                  </Button>
                </form>
              </>
            ) : (
              <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-sm font-medium">
                  Log In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}