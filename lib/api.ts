/* eslint-disable @typescript-eslint/no-explicit-any */
// import { headers } from "next/headers";

// export const api = async (path: string, options?: RequestInit) => {

//   const { headers, ...rest } = options;
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_APP_URL}${path}`, {
//       headers: {
//         "Content-Type": "application/json",
//         ...headers
//       },
//       ...rest
//     })
//     if (!res.ok) {
//       return {
//         success: false,
//         message: "Login failed. Check your credentials.",
//       };
//     }
//     const data = (await res.json()).data;
//     return { ok: true, data }

//   } catch (error) {
//     return { ok: false, message: "Server Error" }
//   }

// }

// export const api = async (path: string, options?: RequestInit) => {
//   const { headers, ...rest } = options || {};
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_APP_URL}${path}`, {
//       headers: {
//         "Content-Type": "application/json",
//         ...headers,
//       },
//       credentials: "include", // <--- এই লাইনটি অবশ্যই থাকতে হবে, যাতে ব্রাউজারের কুকি ব্যাকএন্ডে যায়
//       ...rest,
//     });

//     if (!res.ok) {
//   let errorData;
//   try {
//     errorData = await res.json();
//   } catch (e) {
//     errorData = { message: "Failed to fetch data." };
//   }
//   return {
//     success: false,
//     message: errorData.message || errorData.errorMessages?.[0]?.path ? `${errorData.errorMessages[0].path}: ${errorData.errorMessages[0].message}` : "Failed to fetch data.",
//   };
// }

//     const data = (await res.json()).data;
//     return { ok: true, data };
//   } catch (error) {
//     console.error("API Error:", error);
//     return { ok: false, message: "Server Error" };
//   }
// };

export const api = async (path: string, options?: RequestInit) => {
  const { headers, ...rest } = options || {};
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_APP_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      credentials: "include", 
      ...rest,
    });

    if (!res.ok) {
      let errorData: any;
      try {
        errorData = await res.json();
      } catch (e) {
        errorData = { message: "Failed to fetch data." };
      }
      return {
        success: false,
        message: errorData.message || "Failed to fetch data.",
      };
    }

    const jsonRes = await res.json();
    return { ok: true, data: jsonRes.data };
  } catch (error) {
    console.error("API Error:", error);
    return { ok: false, message: "Server Error" };
  }
};