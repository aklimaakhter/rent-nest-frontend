/* eslint-disable @typescript-eslint/no-explicit-any */

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