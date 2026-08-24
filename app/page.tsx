import Link from "next/link";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  image: string;
  category: {
    name: string;
  };
}

async function getFeaturedProperties(): Promise<Property[]> {
  try {
    // এখানে আপনার ব্যাকএন্ডের লাইভ লিংক বসিয়ে দিন
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_APP_URL || "https://your-backend-api.onrender.com";
    const res = await fetch(`${baseUrl}/api/properties?limit=6`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    
    const responseJson = await res.json();
    const propertyList = responseJson.data || responseJson.properties || responseJson;
    
    return Array.isArray(propertyList) ? propertyList : [];
  } catch (error) {
    return [];
  }
}

export default async function HomePage() {
  const allProperties = await getFeaturedProperties();
  const properties = allProperties.slice(0, 6);

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Hero Section with Background Picture */}
      <section className="relative bg-gray-900 py-32 px-4 text-center overflow-hidden rounded-3xl max-w-7xl mx-auto my-6 shadow-xl">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Find & List Rental Properties with Ease 🏠
          </h1>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto">
            Discover thousands of apartments, houses, and rooms for rent or list your own property in minutes.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              href="/properties"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shadow-lg"
            >
              Browse Properties
            </Link>
            <Link
              href="/auth/register"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 backdrop-blur-md transition"
            >
              Post a Rental
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Featured Properties Section (Max 6 properties) */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Properties</h2>
            <p className="text-gray-500 text-sm mt-1">Explore our top rental recommendations</p>
          </div>
          <Link href="/properties" className="text-emerald-600 font-semibold text-sm hover:underline">
            View All →
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500">No properties found. Make sure your API is running.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition group"
              >
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={item.image || "https://via.placeholder.com/400x250?text=Property"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    {item.category?.name || "Apartment"}
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-gray-900 text-lg truncate">{item.title}</h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1">📍 {item.location}</p>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-xl font-extrabold text-emerald-600">${item.price}</span>
                      <span className="text-gray-400 text-xs"> / month</span>
                    </div>
                    <Link
                      href={`/properties/${item.id}`}
                      className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white text-xs font-semibold rounded-lg transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom View All CTA Button */}
        <div className="text-center mt-12">
          <Link
            href="/properties"
            className="px-8 py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition shadow-md inline-block"
          >
            View All Properties →
          </Link>
        </div>
      </section>

    </div>
  );
}