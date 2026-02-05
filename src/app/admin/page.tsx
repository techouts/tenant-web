"use client";
import { StatCard } from "@/components/statCard";
import { SubscriptionPlansTable } from "@/components/subscriptionPlansTable";
import { TenantRevenueTable } from "@/components/tenantRevenueTable";
import { useEffect, useState } from "react";
import {
  fetchSubscriptionEnding,
  fetchTenantsData,
  fetchTenantsRevenue,
  fetchTotalRevenue,
  getRevenueHistory,
} from "./admin-apis";
import { capitalizeAndCleanString } from "@/lib/CapitalizeString";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const AdminDashboardPage = () => {
  const [tenants, setTenants] = useState<{
    total_tenants: number;
    active_tenants: number;
    deactivated_tenants: number;
  }>({
    total_tenants: 0,
    active_tenants: 0,
    deactivated_tenants: 0,
  });
  const [totalRevenue, setTotalRevenue] = useState<{
    month: string;
    total_revenue: number;
    currency: string;
    year: string;
  }>({
    month: "",
    total_revenue: 0,
    currency: "",
    year: "",
  });
  const [tenantsRevenue, setTenantsRevenue] = useState<
    Array<{
      tenant_id: number;
      tenant_name: string;
      revenue: number;
    }>
  >([
    {
      tenant_id: 0,
      tenant_name: "",
      revenue: 0,
    },
  ]);

  const [subscriptionEnding, setSubscriptionEnding] = useState<{
    filter: string;
    count: number;
    subscriptions: Array<{
      tenant_id: number;
      tenant_name: string;
      plan: string;
      end_date: string;
      is_trial: boolean;
      days_left: number;
    }>;
  }>();

  const [date, setDate] = useState<{ year: number; month: string }>({
    year: new Date().getFullYear(),
    month: new Date().toLocaleString("en-US", {
      month: "short",
    }),
  });

  const [revenueHistory, setRevenueHistory] = useState<{
    currency: string;
    month: string;
    total_revenue: number;
    year: number;
  }>({
    currency: "",
    month: "",
    total_revenue: 0,
    year: new Date().getFullYear(),
  });

  const fetchData = async () => {
    const tenantsData = await fetchTenantsData();
    const totalRevenueData = await fetchTotalRevenue("month");
    const tenantsRevenueData = await fetchTenantsRevenue();
    const subscriptionEndingData = await fetchSubscriptionEnding("quarter");
    if (tenantsData) {
      setTenants(tenantsData);
    }
    if (totalRevenueData) {
      setTotalRevenue(totalRevenueData);
    }
    if (tenantsRevenueData) {
      setTenantsRevenue(tenantsRevenueData);
    }
    if (subscriptionEndingData) {
      setSubscriptionEnding(subscriptionEndingData);
    }
  };

  const handlesubscriptionEnding = async (range: string) => {
    const subscriptionEndingData = await fetchSubscriptionEnding(range);
    if (subscriptionEndingData) {
      setSubscriptionEnding(subscriptionEndingData);
    }
  };
  const handleTotalRevenue = async (range: string) => {
    const totalRevenueData = await fetchTotalRevenue(range);
    if (totalRevenueData) {
      setTotalRevenue(totalRevenueData);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getRevenueHistory(
        date?.year,
        date?.month?.toLowerCase(),
      );
      if (!response?.error) {
        setRevenueHistory(response?.data);
        return;
      } else {
        toast({
          title: "Error",
          description: response?.data?.Error,
          variant: "destructive",
        });
        return;
      }
    };
    fetchData();
  }, [date]);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Tenants" value={tenants?.total_tenants} />
        <StatCard label="Active Tenants" value={tenants?.active_tenants} />
        <StatCard
          label="Deactivated Tenants"
          value={tenants?.deactivated_tenants}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-12">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <div className="space-y-1">
              <Select
                onValueChange={(value) => handleTotalRevenue(value)}
                defaultValue="month"
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Select Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-3xl font-semibold">
            ₹{totalRevenue?.total_revenue?.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {totalRevenue?.month || totalRevenue?.year}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 col-span-2">
          <div className="flex items-center gap-12 ">
            <p className="text-sm text-muted-foreground">Revenue History</p>
            <Card className="mx-auto min-w-80 p-0  bg-background">
              <CardContent className="p-0">
                <Calendar
                  mode="single"
                  captionLayout="dropdown"
                  className="rounded-lg w-full flex p-3"
                  classNames={{
                    table: "hidden",
                    head: "hidden",
                    caption_label: "hidden",
                    dropdown:
                      "bg-slate-800 border border-slate-700 rounded text-white",
                    caption_dropdowns:
                      "flex flex-row justify-between w-[300px]",
                    dropdown_month: "flex items-center gap-2",
                    dropdown_year: "flex items-center gap-2",
                  }}
                  showOutsideDays={false}
                  fromYear={2000}
                  toYear={new Date().getFullYear()}
                  onMonthChange={(value) => {
                    const monthName = value?.toLocaleString("en-US", {
                      month: "short",
                    });
                    const year = value?.getFullYear();
                    setDate({ year: year, month: monthName });
                  }}
                />
              </CardContent>
            </Card>
          </div>
          <p className="text-3xl font-semibold">
            ₹{revenueHistory?.total_revenue?.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {revenueHistory?.month || revenueHistory?.year}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <TenantRevenueTable data={tenantsRevenue || []} />
        <SubscriptionPlansTable
          data={subscriptionEnding?.subscriptions || []}
          title={`Subscription Ending This ${capitalizeAndCleanString(subscriptionEnding?.filter || "")}`}
          type="subscriptionEnding"
          handlesubscriptionEnding={handlesubscriptionEnding}
        />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
