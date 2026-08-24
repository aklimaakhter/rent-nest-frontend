import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        
        {/* Brand Info */}
        <div className="space-y-4">
          <h2 className="text-white text-2xl font-bold flex items-center gap-2">
            RentNest 🏠
          </h2>
          <p className="text-sm text-gray-400">
            Your trusted platform for finding, renting, and listing properties with complete ease and security.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold text-lg">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-white transition">Home</Link>
            </li>
            <li>
              <Link href="/properties" className="hover:text-white transition">Browse Properties</Link>
            </li>
            <li>
              <Link href="/auth/login" className="hover:text-white transition">Login</Link>
            </li>
            <li>
              <Link href="/auth/register" className="hover:text-white transition">Register</Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold text-lg">Categories</h3>
          <ul className="space-y-2 text-sm">
            <li><span className="hover:text-white transition cursor-pointer">Apartments</span></li>
            <li><span className="hover:text-white transition cursor-pointer">Family Houses</span></li>
            <li><span className="hover:text-white transition cursor-pointer">Villas</span></li>
            <li><span className="hover:text-white transition cursor-pointer">Rooms</span></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold text-lg">Contact Us</h3>
          <p className="text-sm text-gray-400">📍 Sylhet, Bangladesh</p>
          <p className="text-sm text-gray-400">📧 support@rentnest.com</p>
          <p className="text-sm text-gray-400">📞 +880 1234 567890</p>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} RentNest. All rights reserved.
      </div>
    </footer>
  );
}