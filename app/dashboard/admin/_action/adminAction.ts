"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";



export async function getAllUsersAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;

  
    const res = await fetch("http://localhost:5000/api/admin/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Backend error status:", res.status);
      return { success: false, data: [] };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, data: [] };
  }
}


export async function toggleUserStatusAction(userId: string, currentStatus: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;
    
    
    const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";
    
    
    const res = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      console.error("Failed to update status, response status:", res.status);
      return { success: false };
    }

    revalidatePath("/dashboard/admin");
    return await res.json();
  } catch (error) {
    console.error("Error updating user status:", error);
    return { success: false };
  }
}

export async function getAllPropertiesAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;

    const res = await fetch("http://localhost:5000/api/admin/properties", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch properties status:", res.status);
      return { success: false, data: [] };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return { success: false, data: [] };
  }
}


export async function getAllRentalsAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;

    const res = await fetch("http://localhost:5000/api/admin/rentals", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch rentals status:", res.status);
      return { success: false, data: [] };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching rentals:", error);
    return { success: false, data: [] };
  }
}