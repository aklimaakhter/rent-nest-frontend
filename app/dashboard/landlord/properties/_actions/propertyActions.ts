/* eslint-disable @typescript-eslint/no-explicit-any */

// "use server";

// import { api } from "@/lib/api";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

// export async function createPropertyAction(prevState: any, formData: FormData) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;

//   const title = formData.get("title");
//   const description = formData.get("description");
//   const price = Number(formData.get("price"));
//   const location = formData.get("location");
//   const image = formData.get("image");
//   const categoryId = formData.get("categoryId");
//   const isAvailable = true;

//   try {
//     const response = await api("/api/landlord/properties", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         title,
//         description,
//         price,
//         location,
//         image,
//         categoryId,
//         isAvailable,
//       }),
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       return { success: false, message: result.message || "Failed to create property" };
//     }
//   } catch (error) {
//     return { success: false, message: "Something went wrong." };
//   }

//   redirect("/dashboard/landlord");
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { api } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createPropertyAction(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;

  const title = formData.get("title");
  const description = formData.get("description");
  const price = Number(formData.get("price"));
  const location = formData.get("location");
  const image = formData.get("image");
  const categoryId = formData.get("categoryId");
  const isAvailable = true;

  try {
    const res = await api("/api/landlord/properties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        price,
        location,
        image,
        categoryId,
        isAvailable,
      }),
    });

    if (!res.ok) {
      return { success: false, message: res.message || "Failed to create property" };
    }

    return { success: true, data: res.data };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong." };
  }
}