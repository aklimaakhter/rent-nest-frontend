
"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerAction } from "../_actions/authAction";
import { toast } from "sonner";

const ROLES = [
  { value: "TENANT", label: "Tenant" },
  { value: "LANDLORD", label: "Landlord" },
];

export default function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state?.message && !state.success) {
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }

  }, [state]);

  return (
    <form action={action} className="space-y-4 w-full">
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Full Name
        </label>
        <Input
          name="name"
          type="text"
          placeholder="Enter Your Full Name"
          required
        />
      </div>

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

      <div className="space-y-2 pt-1">
        <label className="block text-xs font-semibold text-gray-700">
          I want to join as a:
        </label>
        <div className="grid grid-cols-2 gap-3">
          {ROLES.map((role, i) => (
            <label
              key={role.value}
              className="cursor-pointer rounded-lg border p-2 text-sm flex items-center justify-center gap-2 hover:border-emerald-600 transition-colors"
            >
              <Input
                type="radio"
                name="role"
                value={role.value}
                defaultChecked={i === 0}
                className="sr-only"
              />
              <span className="font-medium text-gray-700">{role.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        // disabled={pending}
        className="mt-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        {pending ? "Creating account..." : "Create Account"}
      </Button>

      <div className="text-center text-sm text-gray-600 border-t border-gray-100 pt-3 mt-2">
        Already have an account?{" "}
        <a
          href="/auth/login"
          className="text-emerald-600 font-semibold hover:underline"
        >
          Login
        </a>
      </div>
    </form>
  );
}