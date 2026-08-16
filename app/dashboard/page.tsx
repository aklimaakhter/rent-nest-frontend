import Link from "next/link";
import Image from "next/image";

interface Property {
  _id: string;
  title: string;
  location: string;
  price: number;
  images: string[];
  category: string;
}

async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/properties?limit=6`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.properties || data;
  } catch (error) {
    return [];
  }
}

export default async function HomePage() {
  const properties = await getFeaturedProperties();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="bg-emerald-50 py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Find & List Rental Properties with Ease 🏠
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover thousands of apartments, houses, and rooms for rent or list your own property in minutes.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/properties"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shadow-md"
            >
              Browse Properties
            </Link>
            <Link
              href="/auth/register"
              className="px-6 py-3 bg-white hover:bg-gray-50 text-emerald-600 font-semibold rounded-xl border border-emerald-200 transition"
            >
              Post a Rental
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="max-w-7xl mx-auto px-4">
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
                key={item._id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition group"
              >
                <div className="relative h-48 w-full bg-gray-100">
                  <Image
                    src={item.images?.[0] || "https://via.placeholder.com/400x250?text=Property"}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {item.category || "Apartment"}
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
                      href={`/properties/${item._id}`}
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
      </section>
    </div>
  );
}