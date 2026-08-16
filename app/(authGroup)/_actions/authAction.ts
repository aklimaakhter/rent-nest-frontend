// "use server"

// import { cookies } from "next/headers"
// import { redirect } from "next/navigation"

// type LoginState = {
//     success: boolean,
//     statusCode: number,
//     message: string,
//     data: {
//         accessToken: string,
//         refreshToken: string
//     }
// }
// export const loginAction = async (previousState: LoginState, formData: FormData) => {
//     const email = formData.get("email");
//     const password = formData.get("password");

//     const payload = {
//         email,
//         password
//     }

//     const res = await fetch(`${process.env.BACKEND_APP_URL}/api/auth/login`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(payload)
//     })
//     const result= await res.json();

//     if (result.success) {
//         const cookeStore = await cookies();

//         cookeStore.set("accessToken", result.data.accessToken, {
//             httpOnly: true,
//             maxAge: 60 * 60 * 24,
//             sameSite: "lax"
//         })
//         cookeStore.set("refreshToken", result.data.refreshToken, {
//             httpOnly: true,
//             maxAge: 60 * 60 * 24 * 7,
//             sameSite: "lax"
//         })

//         redirect("/dashboard")
//     }


//     return result
// }