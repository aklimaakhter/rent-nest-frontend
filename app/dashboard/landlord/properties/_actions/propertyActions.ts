
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { api, BASE_URL } from "@/lib/api";
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

export async function getLandlordProperties() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  try {
    const res = await api("/api/landlord/properties", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.error(error);
    return { success: false, data: [] };
  }
}

export async function updatePropertyAction(id: string, prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;

  const title = formData.get("title");
  const description = formData.get("description");
  const price = Number(formData.get("price"));
  const location = formData.get("location");
  const image = formData.get("image");
  const categoryId = formData.get("categoryId");

  try {
    const response = await fetch(`${BASE_URL}/api/landlord/properties/${id}`, {
      method: "PATCH",
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
      }),
    });

    const res = await response.json();

    if (!response.ok || (res && res.success === false)) {
      return { success: false, message: res.message || "Failed to update property" };
    }
  } catch (error) {
    console.error("Error updating property:", error);
    return { success: false, message: "Something went wrong!" };
  }

  redirect("/dashboard/landlord");
}

export async function deletePropertyAction(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;

  try {
    const res = await api(`/api/landlord/properties/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res || res.success === false) {
      return { success: false, message: res?.message || "Failed to delete property" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting property:", error);
    return { success: false, message: "Something went wrong!" };
  }
}