"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DashboardHeader, DashboardShell } from "@/components/dashboard-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { fetchandUpdateBussiness, fetchCatalogTypes } from "../apis";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const profileSchema = z.object({
  businessName: z.string().min(2, "Business name is required."),
  catalog: z.string(),
});

function ProfileForm() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [businessData, setBusinessData] = useState<{
    business_name: string;
    catalog_type: string;
    phone_number: number | null;
    tenant_id: number | null;
    tenant_name: string;
  }>({
    business_name: "",
    catalog_type: "",
    phone_number: null,
    tenant_id: 0,
    tenant_name: "",
  });
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      businessName: businessData?.business_name || "",
      catalog: businessData?.catalog_type,
    },
  });

  const [catalogTypes, setCatalogTypes] = useState([]);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      const payload = {
        business_name: values?.businessName,
        catalog_type: values?.catalog,
      };
      await fetchandUpdateBussiness("PUT", payload);
      toast({ title: "Profile updated successfully!" });
    } catch (error) {
      toast({ title: "Failed to update profile", variant: "destructive" });
    }
  };

  const fetchData = async () => {
    const bussinessData = await fetchandUpdateBussiness("GET", {});
    const catalog = await fetchCatalogTypes();
    if (bussinessData) {
      setBusinessData(bussinessData);
      form.reset({
        businessName: bussinessData?.business_name ?? "",
        catalog: bussinessData?.catalog_type ?? "",
      });
    }
    if (catalog) {
      setCatalogTypes(catalog);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Manage your business and personal information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={user?.avatarUrl}
                  alt={businessData?.business_name}
                />
                <AvatarFallback>{businessData?.business_name}</AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline">
                Change Avatar
              </Button>
            </div>
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              defaultValue={businessData?.catalog_type}
              name="catalog"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catalog Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={businessData?.catalog_type} />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Catalog Types</SelectLabel>
                        {catalogTypes?.map((catalog: any) => (
                          <SelectItem
                            key={catalog?.value}
                            value={catalog?.value}
                          >
                            {catalog?.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={form.formState.isSubmitting}>
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters."),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from the current password.",
    path: ["newPassword"],
  });

function PasswordForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  const onSubmit = async (values: z.infer<typeof passwordSchema>) => {
    try {
      await api.user.updatePassword(values);
      toast({ title: "Password updated successfully!" });
      form.reset();
    } catch (error) {
      toast({
        title: "Failed to update password",
        description: "Please check your current password.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your account password.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Update Password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

const themes = [
  { name: "Default", primary: "222 39% 26%", accent: "176 43% 41%" },
  { name: "Forest", primary: "158 29% 33%", accent: "100 25% 42%" },
  { name: "Ocean", primary: "210 38% 30%", accent: "190 60% 50%" },
  { name: "Sunset", primary: "25 60% 45%", accent: "358 70% 60%" },
];

const appearanceSchema = z.object({});

function AppearanceForm() {
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = React.useState(themes[0].name);
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
  const logoInputRef = React.useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof appearanceSchema>>({});

  const handleThemeChange = (theme: (typeof themes)[0]) => {
    if (typeof window !== "undefined") {
      document.documentElement.style.setProperty("--primary", theme.primary);
      document.documentElement.style.setProperty("--ring", theme.primary);
      document.documentElement.style.setProperty("--accent", theme.accent);
      document.documentElement.style.setProperty(
        "--sidebar-primary",
        theme.accent,
      );
      document.documentElement.style.setProperty(
        "--sidebar-accent",
        theme.primary,
      );
    }
    setSelectedTheme(theme.name);
    toast({ title: `Theme changed to ${theme.name}` });
  };

  const handleLogoUploadClick = () => {
    logoInputRef.current?.click();
  };

  const handleLogoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        toast({ title: "Logo preview updated." });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize your dashboard's look and feel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
            <div className="space-y-2">
              <FormLabel>Business Logo</FormLabel>
              <div className="flex items-center gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className="h-6" />
                  ) : (
                    <Logo />
                  )}
                </div>
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={handleLogoFileChange}
                  className="hidden"
                  accept="image/png, image/jpeg, image/svg+xml"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLogoUploadClick}
                >
                  Upload New Logo
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <FormLabel>Color Theme</FormLabel>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {themes.map((theme) => (
                  <div key={theme.name}>
                    <button
                      type="button"
                      onClick={() => handleThemeChange(theme)}
                      className={cn(
                        "w-full rounded-md border-2 p-2 flex items-center justify-center text-sm font-semibold",
                        selectedTheme === theme.name
                          ? "border-primary"
                          : "border-transparent",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-5 w-5 rounded-full"
                          style={{ backgroundColor: `hsl(${theme.primary})` }}
                        />
                        <div
                          className="h-5 w-5 rounded-full"
                          style={{ backgroundColor: `hsl(${theme.accent})` }}
                        />
                      </div>
                    </button>
                    <p className="text-center text-xs mt-1">{theme.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <Button>Save Appearance Settings</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        title="Settings"
        description="Manage your account and business settings."
      />
      <div className="grid gap-8">
        <ProfileForm />
        <AppearanceForm />
        <PasswordForm />
      </div>
    </DashboardShell>
  );
}
