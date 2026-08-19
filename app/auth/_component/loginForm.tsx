/* eslint-disable react/no-unescaped-entities */
"use client";

import { useActionState, useEffect, } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginAction} from "../_actions/authAction";
import { toast } from "sonner";



export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {
    success: false,
    message: ""
  });

  useEffect(() => {
    if (state?.message && !state.success) {
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }

  }, [state]);

  return (
    <form action={action} className="space-y-4">
      <Card className="p-5 space-y-4 shadow-none border-gray-100">
        <div>
          <Input
            name="email"
            type="email"
            placeholder="Enter Your Email"
            required
          />
        </div>
        <div>
          <Input
            name="password"
            type="password"
            placeholder="Enter Your Password"
            required
          />
        </div>
        <Button
          type="submit"
          // disabled={pending}
          className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {pending ? "Sining in" : "Sign in"}
        </Button>
        <div className="text-center text-sm text-gray-600 pt-3 border-t border-gray-100 mt-2">
          Don't have an account?{" "}
          <a href="/auth/register" className="text-emerald-600 font-semibold hover:underline">
            Sign up
          </a>
        </div>
      </Card>
    </form>
  );
}
