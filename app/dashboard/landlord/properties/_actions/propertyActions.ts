/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { api } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createPropertyAction(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const title = formData.get("title");
  const categoryId = formData.get("categoryId");
  const price = formData.get("price");
  const location = formData.get("location");
  const image = formData.get("image");
  const description = formData.get("description");


  try {
    const payload = {
      title,
      categoryId,
      price: Number(price),
      location,
      image,
      description,
    };

    const res = await api(
      "/api/landlord/properties",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
      token
    );

    if (!res.ok && !res.success) {
      return {
        success: false,
        message: res.message || "Failed to create property.",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong!",
    };
  }

  redirect("/dashboard/landlord");
}