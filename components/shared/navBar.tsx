import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/auth/_actions/authAction"; // আপনার প্রজেক্টের পাথ অনুযায়ী এটি ঠিক করে নিন

export default async function Navbar() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("accessToken")?.value ||
    cookieStore.get("token")?.value;

  return (
    <header className="border-b bg-white sticky top-0 z-50 w-full shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Brand Name */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-10 h-10 sm:w-18 sm:h-18 flex items-center justify-center">
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

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-emerald-600 transition-colors">
            Home
          </Link>
          <Link href="/properties" className="hover:text-emerald-600 transition-colors">
            Properties
          </Link>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {token ? (
            // লগইন করা থাকলে সরাসরি সার্ভার অ্যাকشن (logoutAction) কল হবে
            <form action={logoutAction}>
              <Button
                variant="outline"
                type="submit"
                className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 h-9 px-4 text-sm font-medium"
              >
                Sign Out
              </Button>
            </form>
          ) : (
            // লগইন করা না থাকলে Log In বাটন দেখাবে
            <Link href="/auth/login">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-4 text-sm font-medium">
                Log In
              </Button>
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}