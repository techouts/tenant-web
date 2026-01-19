"use client";
import React, { useState, useEffect } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Mail } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";

type TeamMember = {
  id: string;
  username: string;
  email: string;
  role: string;
  avatarUrl?: string;
  access: string;
};

import {
  activateOrDeactivateMembers,
  getMembers,
  removeUser,
  updateUser,
} from "../apis";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditMemberModal from "@/components/EditMemberModal";

const inviteSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  role: z.enum(["Admin", "Developer", "Viewer"]),
});

function InviteMemberForm({
  onInviteSuccess,
}: {
  onInviteSuccess: () => void;
}) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof inviteSchema>>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      role: "Developer",
    },
  });

  const onSubmit = async (values: z.infer<typeof inviteSchema>) => {
    // try {
    //   await api.user.inviteMember(values);
    //   toast({
    //     title: "Invitation Sent",
    //     description: `${values.email} has been invited.`,
    //   });
    //   form.reset();
    //   onInviteSuccess();
    // } catch (error) {
    //   toast({ title: "Failed to send invitation", variant: "destructive" });
    // }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Member</CardTitle>
        <CardDescription>Add a new member to your project.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 sm:grid-cols-3"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="member@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Developer">Developer</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="sm:col-span-3"
              disabled={form.formState.isSubmitting}
            >
              <Mail className="mr-2 h-4 w-4" />
              {form.formState.isSubmitting ? "Sending..." : "Send Invitation"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export const MembersList = ({ membersData, loading, fetchData }: any) => {
  const [editOpen, setEditOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [status, setStatus] = useState<"activate" | "deactivate">("activate");
  const { toast } = useToast();

  const handleRemoveUser = async (email: string) => {
    try {
      const response = await removeUser(email);
      toast({ title: "Member removed" });
    } catch {
      toast({
        title: "Failed to remove member",
        variant: "destructive",
      });
    }
  };

  const handleEditSave = async (data: {
    email: string;
    password: string;
    access: string;
  }) => {
    if (!selectedMember) return;

    try {
      setSaving(true);
      const response = await updateUser(data);
      if (response) {
        toast({
          title: "Member updated",
          description: "Member details updated successfully",
        });
        fetchData();
      }
      setEditOpen(false);
      setSelectedMember(null);
    } catch {
      toast({
        title: "Update failed",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const openStatusModal = (tenant: any) => {
    setSelectedTenant(tenant);
    setStatus(tenant?.is_active ? "activate" : "deactivate");
    setStatusModalOpen(true);
  };

  const handleStatusSave = async (status: boolean, emailId: string) => {
    const updatedStatus = await activateOrDeactivateMembers(status, emailId);
    // if (updatedStatus) {
    //   const updatedData = tenants?.map((tenant) =>
    //     tenant?.domain === selectedTenant?.domain
    //       ? { ...tenant, is_active: !tenant.is_active }
    //       : tenant
    //   );
    //   setTenants(updatedData || []);
    // }
    if (updatedStatus) {
      fetchData();
    }
    setStatusModalOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage your project's members and their roles.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Access</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading
                ? [membersData?.length].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="h-10 w-48 bg-muted animate-pulse rounded-md" />
                      </TableCell>
                      <TableCell>
                        <div className="h-10 w-48 bg-muted animate-pulse rounded-md" />
                      </TableCell>
                      <TableCell>
                        <div className="h-10 w-24 bg-muted animate-pulse rounded-md" />
                      </TableCell>
                      <TableCell>
                        <div className="h-10 w-8 bg-muted animate-pulse rounded-md ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                : membersData?.map((member: any) => (
                    <TableRow key={member?.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member?.avatarUrl} />
                            <AvatarFallback>{member?.username}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {member?.username}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {member?.email}
                      </TableCell>

                      <TableCell>{member?.role}</TableCell>
                      <TableCell>{member?.access}</TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedMember(member);
                                setEditOpen(true);
                              }}
                            >
                              Edit
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleRemoveUser(member?.email)}
                            >
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <button
                          onClick={() => openStatusModal(member)}
                          className="px-3 py-1 rounded-md border text-xs hover:bg-muted grow"
                        >
                          {member?.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedMember && (
        <EditMemberModal
          open={editOpen}
          member={selectedMember}
          onClose={() => setEditOpen(false)}
          onSave={handleEditSave}
          loading={saving}
        />
      )}

      {statusModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg w-[400px] p-6 space-y-4">
            <h2 className="text-lg font-semibold">Update Tenant Status</h2>
            <p>{`Are you sure to ${
              status === "activate" ? "Deactivate" : "Activate"
            } this tenant`}</p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setStatusModalOpen(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleStatusSave(
                    status === "activate" ? false : true,
                    selectedTenant?.email,
                  )
                }
                className="px-4 py-2 bg-primary text-black rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default function MembersPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    const getUsers = await getMembers();
    if (getUsers) {
      setUsers(getUsers);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardShell>
      <DashboardHeader
        title="Members"
        description="Invite and manage your team."
      />
      <div className="grid gap-8">
        <InviteMemberForm onInviteSuccess={() => setRefreshKey((k) => k + 1)} />
        <MembersList
          membersData={users}
          loading={loading}
          fetchData={fetchData}
        />
      </div>
    </DashboardShell>
  );
}
