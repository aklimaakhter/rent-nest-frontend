// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { api } from "@/lib/api";
// import { useTransition } from "react";
// import { toast } from "sonner";

// export default function RequestRentButton({ propertyId }: { propertyId: string }) {
//   const [isPending, startTransition] = useTransition();

//   const handleRequest = async () => {
//     startTransition(async () => {
//       try {
//         const response = await api("/api/rentals", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include", 
//           body: JSON.stringify({ propertyId }),
//         });

//         const result = await response.json();

//         if (!response.ok || result.success === false) {
//           toast.error(result.message || "Failed to submit request");
//         } else {
//           toast.success("Rental request sent successfully!");
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("Something went wrong!");
//       }
//     });
//   };

//   return (
//     <button
//       onClick={handleRequest}
//       disabled={isPending}
//       className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 shadow-md"
//     >
//       {isPending ? "Submitting..." : "Request to Rent"}
//     </button>
//   );
// }



/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { api } from "@/lib/api";
// import { useTransition } from "react";
// import { toast } from "sonner";

// export default function RequestRentButton({ propertyId }: { propertyId: string }) {
//   const [isPending, startTransition] = useTransition();

//   const handleRequest = async () => {
//     startTransition(async () => {
//       try {
//         const response: any = await api("/api/rentals", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ propertyId }),
//         });

//         if (!response.ok) {
//           toast.error(response.message || "Failed to submit request");
//         } else {
//           toast.success("Rental request sent successfully!");
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("Something went wrong!");
//       }
//     });
//   };

//   return (
//     <button
//       onClick={handleRequest}
//       disabled={isPending}
//       className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 shadow-md"
//     >
//       {isPending ? "Submitting..." : "Request to Rent"}
//     </button>
//   );
// }



/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { api } from "@/lib/api";
import { useTransition } from "react";
import { toast } from "sonner";

export default function RequestRentButton({ propertyId }: { propertyId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleRequest = async () => {
    startTransition(async () => {
      try {
        
        const response: any = await api("/api/rentals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ propertyId }),
        });

        if (!response.ok) {
          toast.error(response.message || "Failed to submit request");
        } else {
          toast.success("Rental request sent successfully!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong!");
      }
    });
  };

  return (
    <button
      onClick={handleRequest}
      disabled={isPending}
      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 shadow-md"
    >
      {isPending ? "Submitting..." : "Request to Rent"}
    </button>
  );
}