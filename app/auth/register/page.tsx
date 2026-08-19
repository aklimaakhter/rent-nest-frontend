
'use client';


import RegisterForm from "../_component/registerForm";


export default function CardDemo() {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md space-y-6 rounded-lg border p-8 shadow-lg">
          <div className="space-y-2 text-center ">
            <h1 className="text-2xl font-bold text-gray-900">Create RentNest Account</h1>
            <p className="text-sm text-gray-500 mt-1">Join as a Tenant or Landlord</p>
          </div>
          <RegisterForm></RegisterForm>
        </div>
        
      </div>
    </>

  )
}


