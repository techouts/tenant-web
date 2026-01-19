"use client";

import React, { useEffect, useState } from "react";
import { DashboardHeader, DashboardShell } from "@/components/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { pricingPlans } from "@/lib/data";
import { useAuth } from "@/contexts/auth-context";
import { CheckCircle, CreditCard, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  DashboardPlans,
  getsubscriptionHistory,
  PurchasePlan,
  TenantSubscriptionPlan,
} from "../apis";

function PlanDetails() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [plans, setPlans] = useState([]);
  const [tenantId, setTenantId] = useState<string>("");

  useEffect(() => {
    const storedUser =
      JSON.parse(localStorage.getItem("userData") || "{}") || {};
    if (storedUser) {
      const parsed = storedUser;
      setTenantId(parsed?.user?.tenantId ?? null);
    }
  }, []);
  const [userplan, setUserplan] = useState<{
    tenant_domain: string;
    plan: string;
    status: string;
    start_date: string;
    end_date: String;
    is_trial: boolean | null;
  }>({
    tenant_domain: "",
    plan: "",
    status: "",
    start_date: "",
    end_date: "",
    is_trial: false,
  });

  const fetchData = async () => {
    const planDetails = await DashboardPlans();
    console.log("planDetails: ", planDetails);
    const userPlanDetails = await TenantSubscriptionPlan();
    console.log("userPlanDetails: ", userPlanDetails);
    if (planDetails) {
      setPlans(planDetails);
    }
    if (userPlanDetails) {
      setUserplan(userPlanDetails);
    }
  };

  const handlePlanChange = async (planId: number) => {
    const response = await PurchasePlan(planId, tenantId);
    fetchData();
    toast({
      title: "Plan Update",
      description: "Your plan has been successfully updated.",
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan & Billing</CardTitle>
        <CardDescription>
          Manage your subscription and billing details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="font-semibold">Current Plan: {userplan?.plan}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans?.map((plan: any, index: number) => (
              <>
                {plan?.is_active && (
                  <Card
                    key={index}
                    className={cn(
                      "flex flex-col",
                      userplan?.plan === plan?.name && "border-primary",
                      userplan?.is_trial === false &&
                        plan?.name === "Free" &&
                        "pointer-events-none cursor-not-allowed",
                    )}
                  >
                    <CardHeader>
                      <CardTitle>{plan?.name}</CardTitle>
                      <div className="flex items-baseline ">
                        <span className="text-3xl font-bold">
                          ${plan?.price}
                        </span>
                        <span className="text-muted-foreground">
                          /{plan?.billing_cycle}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        <span>
                          {plan?.daily_api_limit} API requests/
                          {plan?.billing_cycle}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        <span>
                          {plan?.monthly_api_limit} API requests/
                          {plan?.billing_cycle}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        <span>{plan?.trial_days} Days Trial</span>
                      </div>
                    </CardContent>
                    <CardContent>
                      <Button
                        className="w-full"
                        disabled={
                          (userplan?.plan === plan?.name &&
                            (userplan?.is_trial ?? false)) ||
                          plan?.name === "Free"
                        }
                        onClick={() => handlePlanChange(plan?.id)}
                      >
                        {userplan?.plan === plan?.name
                          ? "Current Plan"
                          : "Switch to " + plan?.name}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BillingHistory() {
  const [history, setHistory] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchHistory = async () => {
      const data = await getsubscriptionHistory();
      if (data) {
        setHistory(data);
      }
    };
    fetchHistory();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing History</CardTitle>
        <CardDescription>View and download your past invoices.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Previous Plan</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history &&
              history?.map((item) => (
                <TableRow key={item?.id}>
                  <TableCell className="font-medium">{item?.id}</TableCell>
                  <TableCell>{item?.start_date?.split("T")[0]}</TableCell>
                  <TableCell>{item?.end_date?.split("T")[0]}</TableCell>
                  <TableCell>{item?.amount}</TableCell>
                  <TableCell>{item?.action}</TableCell>
                  <TableCell>{item?.previous_plan}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <a href={item?.link}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function PaymentMethod() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>
          Update your payment information. This is a UI-only component.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 border p-3 rounded-md">
          <CreditCard className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="font-medium">Visa ending in 4242</p>
            <p className="text-sm text-muted-foreground">Expires 12/2026</p>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Card Number</label>
          <Input placeholder="•••• •••• •••• ••••" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Expires</label>
            <Input placeholder="MM / YY" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">CVC</label>
            <Input placeholder="123" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">ZIP</label>
            <Input placeholder="12345" />
          </div>
        </div>
        <Button>Update Payment Method</Button>
      </CardContent>
    </Card>
  );
}

export default function BillingPage() {
  return (
    <DashboardShell className="mb-5">
      <DashboardHeader
        title="Billing"
        description="Manage your subscription, payment method, and view invoices."
      />
      <div className="grid gap-8">
        <PlanDetails />
        <div className="grid gap-8 lg:grid-cols-1">
          <BillingHistory />
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <PaymentMethod />
        </div>
      </div>
    </DashboardShell>
  );
}
