"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/auth-context";
import { Logo } from "@/components/logo";
import { handler } from "@/services/loginApiService";
import { useEffect, useState } from "react";

const signupSchema = z.object({
  businessName: z
    .string()
    .min(2, { message: "Business name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string(),
  plan: z.preprocess(
    (val) => Number(val),
    z.number({ required_error: "You need to select a plan." }),
  ),
});

export default function SignupPage() {
  const { signup } = useAuth();
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      businessName: "",
      email: "",
      password: "",
      plan: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    await signup(values);
  };

  const fetchData = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/subscription/plans/`;
    const plans = await handler.apiCall(url, "GET", {});

    if (plans) {
      setSubscriptionPlans(plans?.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen py-12 bg-primary/5">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-headline">
            Create an Account
          </CardTitle>
          <CardDescription>
            Join Forward and supercharge your product search.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form?.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form?.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Company Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form?.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@yourcompany.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form?.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form?.control}
                name="plan"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Select a plan</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={String(field.value)}
                        className="flex flex-col space-y-1"
                      >
                        {subscriptionPlans?.map((plan: any) => (
                          <FormItem
                            key={plan?.id}
                            className="flex items-center space-x-3 space-y-0 p-3 rounded-md border has-[:checked]:bg-accent/10 has-[:checked]:border-accent"
                          >
                            <FormControl>
                              <RadioGroupItem value={String(plan.id)} />
                            </FormControl>
                            <FormLabel className="font-normal w-full cursor-pointer">
                              <div className="flex justify-between items-center">
                                <span>{plan?.name}</span>
                                <span className="font-bold">
                                  ₹{plan?.price}
                                  <span className="font-normal text-sm text-muted-foreground">
                                    /mo
                                  </span>
                                </span>
                              </div>
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Creating account..."
                  : "Create Account"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
