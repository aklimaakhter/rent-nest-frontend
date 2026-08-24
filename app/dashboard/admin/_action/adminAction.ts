/* eslint-disable @typescript-eslint/no-explicit-any */
// "use server";

// import { api } from "@/lib/api";
// import { revalidatePath } from "next/cache";
// import { cookies } from "next/headers";



// export async function getAllUsersAction() {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;

  
//     const res = await api("/api/admin/users", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       cache: "no-store",
//     });

//     if (!res.ok) {
//       console.error("Backend error status:", res.status);
//       return { success: false, data: [] };
//     }

//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     return { success: false, data: [] };
//   }
// }


// export async function toggleUserStatusAction(userId: string, currentStatus: string) {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;
    
    
//     const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";
    
    
//     const res = await api(`/api/admin/users/${userId}`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`, 
//       },
//       body: JSON.stringify({ status: newStatus }),
//     });

//     if (!res.ok) {
//       console.error("Failed to update status, response status:", res.status);
//       return { success: false };
//     }

//     revalidatePath("/dashboard/admin");
//     return await res.json();
//   } catch (error) {
//     console.error("Error updating user status:", error);
//     return { success: false };
//   }
// }

// export async function getAllPropertiesAction() {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;

//     const res = await api("/api/admin/properties", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       cache: "no-store",
//     });

//     if (!res.ok) {
//       console.error("Failed to fetch properties status:", res.status);
//       return { success: false, data: [] };
//     }

//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching properties:", error);
//     return { success: false, data: [] };
//   }
// }


// export async function getAllRentalsAction() {
//   try {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;

//     const res = await api("/api/admin/rentals", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       cache: "no-store",
//     });

//     if (!res.ok) {
//       console.error("Failed to fetch rentals status:", res.status);
//       return { success: false, data: [] };
//     }

//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching rentals:", error);
//     return { success: false, data: [] };
//   }
// }


"use server";

import { api } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getAllUsersAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;

    const res: any = await api("/api/admin/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Backend error message:", res.message);
      return { success: false, data: [] };
    }

   
    const usersData = res.data;
    return {
      success: true,
      data: Array.isArray(usersData) ? usersData : usersData?.users || usersData?.data || [],
    };
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
    
    const res: any = await api(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      console.error("Failed to update status, message:", res.message);
      return { success: false };
    }

    revalidatePath("/dashboard/admin");
    return { success: true, ...res };
  } catch (error) {
    console.error("Error updating user status:", error);
    return { success: false };
  }
}

export async function getAllPropertiesAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;

    const res: any = await api("/api/admin/properties", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch properties message:", res.message);
      return { success: false, data: [] };
    }

    const propertiesData = res.data;
    return {
      success: true,
      data: Array.isArray(propertiesData) ? propertiesData : propertiesData?.properties || propertiesData?.data || [],
    };
  } catch (error) {
    console.error("Error fetching properties:", error);
    return { success: false, data: [] };
  }
}

export async function getAllRentalsAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value || cookieStore.get("token")?.value;

    const res: any = await api("/api/admin/rentals", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch rentals message:", res.message);
      return { success: false, data: [] };
    }

    const rentalsData = res.data;
    return {
      success: true,
      data: Array.isArray(rentalsData) ? rentalsData : rentalsData?.rentals || rentalsData?.data || [],
    };
  } catch (error) {
    console.error("Error fetching rentals:", error);
    return { success: false, data: [] };
  }
}