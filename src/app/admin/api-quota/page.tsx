"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchApiQuotas, updateApiQuotas } from "../admin-apis";
import { useToast } from "@/hooks/use-toast";

type Tenant = {
  tenant_id: number;
  tenant_name: string;
  api_rate_limit: number;
  api_usage: {
    today_used: number;
    monthly_used: number;
    daily_limit: number;
    monthly_limit: number;
  };
  tenant_domain: string;
};

export default function ManageApiQuotaPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const { toast } = useToast();
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [dailyLimit, setDailyLimit] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [apiRateLimit, setApiRateLimit] = useState("");

  const openEditModal = (tenant: Tenant) => {
    setSelectedTenant(tenant);
  };

  const handleSave = async () => {
    if (!selectedTenant) return;
    const response = await updateApiQuotas({
      tenant_id: selectedTenant?.tenant_id,
      daily_limit: Number(dailyLimit) || 0,
      monthly_limit: Number(monthlyLimit) || 0,
      api_rate_limit: Number(apiRateLimit) || 0,
    });
    const updatedTenants = tenants?.map((tenant: Tenant) =>
      tenant?.tenant_id === response?.tenant_id
        ? {
            ...tenant,
            api_usage: {
              ...tenant.api_usage,
              daily_limit: Number(response?.daily_limit),
              monthly_limit: Number(response?.monthly_limit),
            },
            api_rate_limit: Number(response?.api_rate_limit),
          }
        : tenant,
    );
    setTenants(updatedTenants);
    setDailyLimit("");
    setMonthlyLimit("");
    setApiRateLimit("");

    if (!response?.error) {
      toast({
        description: `API Quota updated successfully for ${selectedTenant?.tenant_name}`,
      });
    }
    setSelectedTenant(null);
  };

  const fetchData = async () => {
    const fetchApiQuotaData = await fetchApiQuotas();
    if (fetchApiQuotaData) {
      setTenants(fetchApiQuotaData);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Manage API Quotas</CardTitle>
        </CardHeader>

        <CardContent className=" h-[450px] overflow-y-scroll">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant Name</TableHead>
                <TableHead>Daily Limit</TableHead>
                <TableHead>Monthly Limit</TableHead>
                {/* <TableHead>Api Rate Limit</TableHead> */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {tenants?.map((tenant) => (
                <TableRow key={tenant?.tenant_id}>
                  <TableCell className="font-medium">
                    {tenant?.tenant_name}
                  </TableCell>
                  <TableCell>{tenant?.api_usage?.daily_limit}</TableCell>
                  <TableCell>{tenant?.api_usage?.monthly_limit}</TableCell>
                  {/* <TableCell>{tenant?.api_rate_limit}</TableCell> */}
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(tenant)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedTenant}
        onOpenChange={() => setSelectedTenant(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit API Quota</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Daily Limit</Label>
              <Input
                type="number"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label>Monthly Limit</Label>
              <Input
                type="number"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Api Rate Limit</Label>
              <Input
                type="number"
                value={apiRateLimit}
                onChange={(e) => setApiRateLimit(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTenant(null)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
