"use client";

import { SubscriptionPlansTable } from "@/components/subscriptionPlansTable";
import { useEffect, useState } from "react";
import { createSubscription, fetchSubscriptionPlans } from "../admin-apis";
import { Button } from "@/components/ui/button";
import { CreateSubscriptionModal } from "@/components/create-subscription-modal";
import { useToast } from "@/hooks/use-toast";

const SubscriptionPage = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    const subscriptionPlansData = await fetchSubscriptionPlans();
    if (subscriptionPlansData) {
      setSubscriptionPlans(subscriptionPlansData);
    }
  };

  const subscriptionPlan = async (payload: any) => {
    const response = await createSubscription(payload);
    toast({
      description: response?.code,
      duration: 3000,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Subscription Plans</h1>
        <Button onClick={() => setOpenCreateModal(true)}>
          Create Subscription
        </Button>
      </div>

      <SubscriptionPlansTable
        data={subscriptionPlans}
        type="subscriptionPlans"
      />

      <CreateSubscriptionModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSuccess={() => {
          setOpenCreateModal(false);
          fetchData();
        }}
        subscriptionPlan={subscriptionPlan}
      />
    </div>
  );
};

export default SubscriptionPage;
