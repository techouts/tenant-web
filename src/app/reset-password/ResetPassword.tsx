"use client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { handler } from "@/services/apiService";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const uid = searchParams?.get("uid");
  const token = searchParams?.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/reset-password/`;
    const payload = {
      uid,
      token,
      new_password: confirmPassword,
    };
    setError(null);
    if (password?.length === 0 || confirmPassword?.length === 0) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password did not matched");
      return;
    }
    try {
      const response = await handler.apiCall(url, "POST", payload, {});
      if (!response?.error) {
        toast({
          description: response?.data?.message,
        });
        window.location.href = "/login";
      }
    } catch (err) {
      setError("Failed to reset password");
      toast({
        description: "Failed to reset password",
      });
    }
    toast({
      description: "Your password has been reset successfully.",
    });
    setSuccess(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>
            Create a new password for your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="p-0 border-none">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full">
              Reset password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
