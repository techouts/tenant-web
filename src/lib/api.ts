// This file contains mock API functions.
// In a real application, you would replace these with actual API calls to your backend.

import { handler as loginHandler } from "@/services/loginApiService";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  auth: {
    login: async (credentials: any) => {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/login/`;
      const response = await loginHandler.apiCall(url, "POST", credentials);
      return {
        accessToken: response?.data?.access,
        refreshToken: response?.data?.refresh,
        user: {
          role: response?.data?.role,
          tenant: response?.data?.tenant,
          tenantId: response?.data?.tenant_id,
          sessionId: response?.data?.session_id,
        },
      };
    },
    signup: async (data: any) => {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/signup/`;
      const payload = {
        admin_email: data?.email,
        admin_password: data?.password,
        business_name: data?.businessName,
        plan_id: Number(data?.plan),
      };
      const response = await loginHandler.apiCall(url, "POST", payload);
      return response?.data;
    },
    logout: async (data: any) => {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}tenants/logout-all/`;
      const payload = {
        email: data?.email,
      };
      await loginHandler.apiCall(url, "POST", payload);
    },
    forgotPassword: async (email: string) => {
      await wait(500);
      console.log("Requesting password reset for:", email);
      return { message: "Password reset link sent." };
    },
  },
  catalog: {
    upload: async (file: File, onProgress: (progress: number) => void) => {
      console.log("Uploading catalog:", file.name);
      // Simulate upload progress
      for (let p = 0; p <= 100; p += 10) {
        await wait(100);
        onProgress(p);
      }
      return {
        message: "Catalog uploaded successfully and is being processed.",
      };
    },
    getUploadedCatalogs: async () => {
      await wait(500);
      const { mockCatalogFiles } = await import("./data");
      return mockCatalogFiles;
    },
  },
  search: {
    testQuery: async (query: string) => {
      await wait(300);
      console.log("Testing search query:", query);
      const { mockSearchResults } = await import("./data");
      if (!query) return [];
      return mockSearchResults.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()),
      );
    },
  },
  user: {
    getMetrics: async () => {
      await wait(500);
      const { mockUser, mockApiUsage } = await import("./data");
      return {
        dailyLimit: mockUser.plan.limits.apiRequests,
        usageToday: mockApiUsage[mockApiUsage.length - 1].requests,
        usageHistory: mockApiUsage,
      };
    },
    getKeys: async () => {
      await wait(500);
      return {
        clientId: `cid-mock-${Date.now().toString().slice(-6)}`,
        accessKey: `akey-mock-${Math.random().toString(36).substring(2, 15)}`,
        baseUrl: "https://api.forward.com/v1",
      };
    },
    regenerateKeys: async () => {
      await wait(500);
      return {
        clientId: `cid-mock-${Date.now().toString().slice(-6)}`,
        accessKey: `akey-mock-${Math.random().toString(36).substring(2, 15)}`,
        baseUrl: "https://api.forward.com/v1",
      };
    },
    updateProfile: async (data: any) => {
      await wait(500);
      console.log("Updating profile with:", data);
      return { message: "Profile updated successfully." };
    },
    updatePassword: async (data: any) => {
      await wait(500);
      console.log("Updating password.");
      return { message: "Password updated successfully." };
    },
    getTeamMembers: async () => {
      await wait(500);
      const { mockTeamMembers } = await import("./data");
      return mockTeamMembers;
    },
    inviteMember: async (data: { email: string; role: string }) => {
      await wait(500);
      console.log("Inviting member:", data);
      return { message: "Invitation sent successfully." };
    },
    resetPassword: async (userId: string) => {
      await wait(500);
      console.log("Sending password reset for user:", userId);
      return { message: "Password reset email sent." };
    },
  },
  billing: {
    updatePlan: async (planId: string) => {
      await wait(500);
      console.log("Updating plan to:", planId);
      return { message: "Plan updated successfully." };
    },
    getBillingHistory: async () => {
      await wait(500);
      return [
        {
          id: "inv-1",
          date: "2024-07-01",
          amount: "$199.00",
          status: "Paid",
          link: "#",
        },
        {
          id: "inv-2",
          date: "2024-06-01",
          amount: "$199.00",
          status: "Paid",
          link: "#",
        },
        {
          id: "inv-3",
          date: "2024-05-01",
          amount: "$49.00",
          status: "Paid",
          link: "#",
        },
      ];
    },
    updatePaymentMethod: async (data: any) => {
      await wait(500);
      console.log("Updating payment method.");
      return { message: "Payment method updated." };
    },
  },
};
