// import Image from "next/image";
// import Link from "next/link";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { MapPin, Bed, Bath, Square } from "lucide-react";

// interface PropertyCardProps {
//   id: string;
//   title: string;
//   location: string;
//   price: number;
//   image: string;
//   bedrooms: number;
//   bathrooms: number;
//   size: number;
//   type: string;
// }

// export default function PropertyCard({
//   id,
//   title,
//   location,
//   price,
//   image,
//   bedrooms,
//   bathrooms,
//   size,
//   type,
// }: PropertyCardProps) {
//   return (
//     <Card className="overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between rounded-xl">
      
      
//       <div className="relative h-52 w-full overflow-hidden bg-gray-100">
//         <Image
//           src={image || "/placeholder.png"}
//           alt={title}
//           fill
//           className="object-contain hover:scale-105 transition-transform duration-500"
//         />
//         <div className="absolute top-3 left-3">
//           <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1 shadow">
//             {type}
//           </Badge>
//         </div>
//       </div>

//       {/* কার্ড কন্টেন্ট */}
//       <CardContent className="p-5 flex flex-col flex-grow">
        
//         {/* লোকেশন */}
//         <div className="flex items-center gap-1 text-gray-500 text-xs mb-1.5">
//           <MapPin className="w-3.5 h-3.5 text-emerald-600" />
//           <span>{location}</span>
//         </div>

//         {/* টাইটেল */}
//         <h3 className="font-bold text-gray-800 text-base line-clamp-1 mb-2">
//           {title}
//         </h3>

//         {/* বেড, বাথ ও সাইজ ইনফো */}
//         <div className="flex items-center justify-between text-gray-600 text-xs border-y border-gray-100 py-2.5 my-2">
//           <div className="flex items-center gap-1">
//             <Bed className="w-4 h-4 text-emerald-600" />
//             <span>{bedrooms} Beds</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <Bath className="w-4 h-4 text-emerald-600" />
//             <span>{bathrooms} Baths</span>
//           </div>
//           <div className="flex items-center gap-1">
//             <Square className="w-4 h-4 text-emerald-600" />
//             <span>{size} sqft</span>
//           </div>
//         </div>
//       </CardContent>

//       {/* কার্ড ফুটার (দাম এবং ডিটেইলস বাটন) */}
//       <CardFooter className="p-5 pt-0 flex items-center justify-between mt-auto">
//         <div>
//           <span className="text-lg font-bold text-emerald-600">${price}</span>
//           <span className="text-xs text-gray-500"> /month</span>
//         </div>
//         <Link href={`/properties/${id}`}>
//           <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4">
//             View Details
//           </Button>
//         </Link>
//       </CardFooter>

//     </Card>
//   );
// }