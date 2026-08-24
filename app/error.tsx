// 'use client' 
 
// import { useEffect } from 'react'
 
// export default function Error({
//   error,
//   retry,
// }: {
//   error: Error & { digest?: string }
//   retry: () => void
// }) {
//   useEffect(() => {
   
//     console.error(error)
//   }, [error])
 
//   return (
//     <div>
//       <h2>Something went wrong!</h2>
//       <button
//         onClick={
          
//           () => retry()
//         }
//       >
//         Try again
//       </button>
//     </div>
//   )
// }



"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="bg-red-50 border border-red-100 rounded-2xl p-8 max-w-md w-full shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-red-600">Something went wrong!</h2>
        <p className="text-xs text-gray-500">
          An unexpected error occurred while loading this page. Please try again.
        </p>
        <Button
          onClick={() => reset()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 px-4 font-semibold"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}