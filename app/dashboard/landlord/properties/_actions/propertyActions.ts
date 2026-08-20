/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use server";

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
//     const response = await fetch("http://localhost:5000/api/landlord/properties", {
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


"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createPropertyAction(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;

  const propertyData = {
    title: formData.get("title"),
    description: formData.get("description"),
    price: Number(formData.get("price")),
    location: formData.get("location"),
    categoryId: formData.get("categoryId"),
    image: formData.get("image"),
    isAvailable: true,
  };

  try {
    const response = await fetch("http://localhost:5000/api/landlord/properties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(propertyData),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || "Failed to create property" };
    }
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }

  redirect("/dashboard/landlord");
}