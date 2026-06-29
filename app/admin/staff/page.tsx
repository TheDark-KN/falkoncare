"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import type { Id } from "@/convex/_generated/dataModel";

export default function AdminStaffPage() {
  const rawUsers = useQuery(api.admin.getAllUsers);
  const users = useMemo(() => rawUsers ?? [], [rawUsers]);
  const addStaffMutation = useMutation(api.admin.addStaff);
  const updateStatusMutation = useMutation(api.admin.updateStaffStatus);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter staff from users
  const staff = useMemo(() => {
    return users.filter((u: any) => u.role === "staff");
  }, [users]);

  const stats = useMemo(() => {
    return [
      { label: "Total Staff", value: staff.length, icon: Icons.users, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20" },
      { label: "Available", value: staff.filter((s: any) => s.status === "available").length, icon: Icons.checkCircle, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" },
      { label: "Busy", value: staff.filter((s: any) => s.status === "busy").length, icon: Icons.clock, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20" },
      { label: "Off Duty", value: staff.filter((s: any) => s.status === "off-duty").length, icon: Icons.xCircle, color: "text-slate-500 bg-slate-50 dark:bg-slate-950/20" },
    ];
  }, [staff]);

  const handleStatusChange = async (staffId: Id<"users">, newStatus: string) => {
    try {
      await updateStatusMutation({ staffId, status: newStatus });
      toast.success("Staff status updated successfully");
    } catch (e) {
      toast.error("Failed to update staff status");
    }
  };

  const handleAddStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error("Please fill out all fields");
      return;
    }
    // Phone validation
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      toast.error("Enter a valid 10-digit mobile number");
      return;
    }

    setIsSubmitting(true);
    try {
      await addStaffMutation({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: cleanPhone,
      });
      toast.success("Staff member registered successfully!");
      setIsModalOpen(false);
      setName("");
      setEmail("");
      setPhone("");
    } catch (err: any) {
      toast.error(err.message || "Failed to add staff member");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black font-headline text-slate-900 dark:text-white tracking-tight">
            Staff Management
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Register and monitor field technicians assigned to cleaning services
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/10"
        >
          <Icons.plus className="w-4 h-4" /> Register Staff
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 leading-none">{stat.value}</p>
                </div>
                <div className={cn("p-2.5 rounded-xl", stat.color)}>
                  <IconComponent className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Staff List Grid */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-base font-bold font-headline text-slate-900 dark:text-slate-50">
            Registered Field Staff
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {staff.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Icons.users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No registered staff members found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {staff.map((member: any) => (
                <div key={member._id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg border border-blue-100/50 dark:border-blue-900/30">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                        {member.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                        <Icons.mail className="w-3.5 h-3.5 text-slate-400" />
                        {member.email}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                        <Icons.phone className="w-3.5 h-3.5 text-slate-400" />
                        {member.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="text-right mr-3 hidden sm:block">
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Completed Jobs</p>
                      <p className="text-sm font-bold text-slate-950 dark:text-slate-100">{member.bookingCount ?? 0}</p>
                    </div>
                    <select
                      value={member.status || "available"}
                      onChange={(e) => handleStatusChange(member._id, e.target.value)}
                      className={cn(
                        "text-xs px-3 py-2 rounded-xl font-bold border bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500",
                        member.status === "available" && "text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40",
                        member.status === "busy" && "text-amber-600 bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/40",
                        member.status === "off-duty" && "text-slate-500 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
                      )}
                    >
                      <option value="available">🟢 Available</option>
                      <option value="busy">🟡 Busy</option>
                      <option value="off-duty">⚪ Off Duty</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Staff Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-2xl max-w-md w-full shadow-2xl space-y-4 animate-in fade-in-50 zoom-in-95 duration-100">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold font-headline text-slate-900 dark:text-white">Register Staff Member</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Icons.x className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="staff-name" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Full Name
                </Label>
                <Input
                  id="staff-name"
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="min-h-[44px] text-base border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="staff-email" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Email Address
                </Label>
                <Input
                  id="staff-email"
                  type="email"
                  placeholder="john.doe@falkoncare.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-h-[44px] text-base border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="staff-phone" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Mobile Number
                </Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">+91</span>
                  <Input
                    id="staff-phone"
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="min-h-[44px] text-base pl-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 min-h-[44px] border-slate-200 dark:border-slate-800 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
                >
                  {isSubmitting ? (
                    <>
                      <Icons.loader className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Member"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
