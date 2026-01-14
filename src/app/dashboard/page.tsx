"use client";

import { useAuth } from "@/contexts/auth-context";
import { DashboardHeader, DashboardShell } from "@/components/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, KeyRound, Search, Upload } from "lucide-react";
import Link from "next/link";
import { mockApiUsage } from "@/lib/data";
import { handler } from "@/services/apiService";
import { useEffect, useState } from "react";
import {
  fetchApiUsageData,
  getTenantDetails,
  TenantSubscriptionPlan,
} from "./apis";

const quickLinks = [
  {
    title: "Upload Catalog",
    description: "Add or update your products.",
    href: "/dashboard/catalog",
    icon: Upload,
  },
  {
    title: "Test Queries",
    description: "Experiment in the playground.",
    href: "/dashboard/playground",
    icon: Search,
  },
  {
    title: "Get API Keys",
    description: "Access your credentials.",
    href: "/dashboard/api",
    icon: KeyRound,
  },
  {
    title: "View Usage",
    description: "Monitor your API requests.",
    href: "/dashboard/usage",
    icon: BarChart2,
  },
];

export default function DashboardOverviewPage() {
  const { user } = useAuth();

  const planDetails =
    JSON.parse(
      global?.window?.localStorage.getItem("userPlanDetails") || "{}"
    ) || "";

  const [usageToday, setUsageToday] = useState<any | null>(null);
  const [tenantDetails, setTenantDetails] = useState<{
    tenant_id: number;
    tenant_domain: string;
    secret_key: string;
  }>({
    tenant_domain: "",
    secret_key: "",
    tenant_id: 0,
  });

  const fetchData = async () => {
    const apiUsageData = await fetchApiUsageData();
    const userPlanDetails = await TenantSubscriptionPlan();
    const TenantDetails = await getTenantDetails();
    if (apiUsageData) {
      setUsageToday(apiUsageData);
    }
    if (userPlanDetails) {
      global?.window?.localStorage.setItem(
        "userPlanDetails",
        JSON.stringify({
          ...userPlanDetails,
        })
      );
    }
    if (TenantDetails) {
      setTenantDetails(TenantDetails);
    }
    global?.window?.localStorage.setItem(
      "secret-key",
      JSON.stringify(TenantDetails?.secret_key || "")
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardShell>
      <DashboardHeader
        title={`Welcome, ${user?.name?.split(" ")[0]}!`}
        description="Here's a quick look at your Forward account."
      />
      <div className="flex gap-4">
        <Card className="grow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              API Usage Today
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usageToday?.today_used?.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              of {usageToday?.monthly_limit?.toLocaleString()} requests
            </p>
          </CardContent>
        </Card>
        <Card className="grow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{planDetails?.plan}</div>
            <p className="text-xs text-muted-foreground">
              ${planDetails?.price}/month
            </p>
          </CardContent>
        </Card>
        <Card className="grow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tenant Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold flex items-center gap-2">
              Tenant Id:
              <p className="text-xs text-muted-foreground">
                {tenantDetails?.tenant_id}
              </p>
            </div>
            <div className="text-sm font-bold flex items-center gap-2">
              Tenant Domain:
              <p className="text-xs text-muted-foreground">
                {tenantDetails?.tenant_domain}
              </p>
            </div>
            <div className="text-sm font-bold flex items-center gap-2">
              Tenant SecretKey:
              <p className="text-xs text-muted-foreground">
                {tenantDetails?.secret_key}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Quick Links</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickLinks?.map((link) => (
            <Card key={link.href} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <link.icon className="h-5 w-5 text-accent" />
                  {link.title}
                </CardTitle>
                <CardDescription>{link.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" size="sm">
                  <Link href={link.href}>
                    Go <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
