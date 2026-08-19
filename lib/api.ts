import { headers } from "next/headers";

export const api = async (path: string, options?: RequestInit) => {
  const { headers, ...rest } = options;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_APP_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      ...rest
    })
    if (!res.ok) {
      return {
        success: false,
        message: "Login failed. Check your credentials.",
      };
    }
    const data = (await res.json()).data;
    return { ok: true, data }

  } catch (error) {
    return { ok: false, message: "Server Error" }
  }

}
// export const api = async (path: string, options?: RequestInit) => {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_APP_URL}${path}`, {
//       headers: {
//         "Content-Type": "application/json",
//         ...options?.headers,
//       },
//       ...options,
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       return {
//         ok: false,
//         message: data.message || "Something went wrong",
//       };
//     }

//     return {
//       ok: true,
//       data: data.data || data
//     };

//   } catch (error) {
//     return {
//       ok: false,
//       message: "Server Error"
//     };
//   }
// }