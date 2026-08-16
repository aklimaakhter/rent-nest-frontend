"use client";

import { useEffect, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginAction } from "../_actions/authAction";
import { toast } from "sonner";

const ROLE_ROUTES: Record<string, string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
};

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast.success(state.message);
        
        // সঠিক রোলের ড্যাশবোর্ডে রিডাইরেক্ট
        const targetRoute = ROLE_ROUTES[state.role || "LANDLORD"] || "/dashboard/landlord";
        window.location.href = targetRoute;
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <form action={action} className="space-y-4">
      <Card className="p-5 space-y-4 shadow-none border-gray-100">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Email Address
          </label>
          <Input
            name="email"
            type="email"
            placeholder="Enter Your Email"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Password
          </label>
          <Input
            name="password"
            type="password"
            placeholder="Enter Your Password"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={pending}
          className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {pending ? "Submitting..." : "Login"}
        </Button>
      </Card>
    </form>
  );
}