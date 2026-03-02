import { Satellite } from "@/components/icons";
import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useLogin } from "./useLogin";

export function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, isPending, isError, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ userId, password });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background brand-gradient px-4">
      <Card className="w-full max-w-sm rounded-2xl shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
            <Satellite className="size-7" />
          </div>
          <CardTitle className="text-2xl font-extrabold tracking-tight">
            LARVIS
          </CardTitle>
          <CardDescription>
            Sign in to access the satellite dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {error?.message ?? "Unknown error"}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="userId"
                className="text-xs font-medium tracking-wide"
              >
                User ID
              </Label>
              <Input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="alice, bob, or charlie"
                required
                autoComplete="username"
                disabled={isPending}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs font-medium tracking-wide"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                disabled={isPending}
                className="h-10"
              />
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Logging in…" : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className="mt-6 text-[11px] text-muted-foreground/60 tracking-wide">
        LARVIS Satellite Intelligence Platform
      </p>
    </div>
  );
}
