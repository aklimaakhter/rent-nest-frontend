export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Title & Subtitle Skeleton */}
      <div className="space-y-3">
        <div className="h-8 w-72 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl animate-pulse" />
        <div className="h-4 w-96 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded-lg animate-pulse" />
      </div>

      {/* Property Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="bg-white border border-gray-100 rounded-2xl p-4 space-y-4 shadow-sm"
          >
            {/* Property Image Placeholder with Badge */}
            <div className="relative w-full h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl animate-pulse overflow-hidden">
              <div className="absolute top-3 right-3 h-6 w-20 bg-gray-300/60 rounded-full animate-pulse" />
            </div>
            
            {/* Title & Location Skeleton */}
            <div className="space-y-2 pt-1">
              <div className="h-5 w-4/5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md animate-pulse" />
              <div className="h-4 w-2/5 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded-md animate-pulse" />
            </div>

            {/* Description Lines */}
            <div className="space-y-1.5 pt-1">
              <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
              <div className="h-3 w-3/4 bg-gray-100 rounded animate-pulse" />
            </div>

            {/* Price & Action Button Skeleton */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <div className="h-6 w-28 bg-gradient-to-r from-emerald-100 via-emerald-50 to-emerald-100 rounded-md animate-pulse" />
              <div className="h-8 w-24 bg-gray-200 rounded-xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}