"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AdminTopBar } from "@/components/admin/admin-top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import type { Id } from "@/convex/_generated/dataModel";

export default function AdminCustomersPage() {
  const rawUsers = useQuery(api.admin.getAllUsers);
  const rawBookings = useQuery(api.admin.getAllBookings);
  const bookings = useMemo(() => rawBookings ?? [], [rawBookings]);
  const sendNotification = useMutation(api.admin.sendNotificationToUser);

  const users = useMemo(() => rawUsers ?? [], [rawUsers]);

  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [notifCustomer, setNotifCustomer] = useState<any | null>(null);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Group and unique by email to prevent multiple entries for the same customer
  const uniqueCustomers = useMemo(() => {
    const customerList = users.filter((u: any) => u.role === "customer" || u.role === "user" || !u.role);
    const seen = new Set();
    const result = [];
    for (const c of customerList) {
      const rawEmail = c.email;
      const email = typeof rawEmail === "string" ? rawEmail.toLowerCase().trim() : null;
      if (email) {
        if (!seen.has(email)) {
          seen.add(email);
          result.push(c);
        }
      } else {
        result.push(c);
      }
    }
    return result;
  }, [users]);

  // Find bookings for the selected customer
  const customerBookings = useMemo(() => {
    if (!selectedCustomer) return [];
    return bookings.filter(
      (b: any) =>
        b.userId === selectedCustomer._id ||
        String(b.user?.email || "").toLowerCase().trim() === String(selectedCustomer.email || "").toLowerCase().trim()
    );
  }, [selectedCustomer, bookings]);

  const handleSendNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifCustomer || !notifTitle.trim() || !notifMessage.trim()) {
      toast.error("Please fill in all notification fields");
      return;
    }

    setIsSending(true);
    try {
      await sendNotification({
        userId: notifCustomer._id,
        type: "system",
        title: notifTitle.trim(),
        message: notifMessage.trim(),
        sendEmail,
      });
      toast.success("Notification delivered successfully!");
      setNotifCustomer(null);
      setNotifTitle("");
      setNotifMessage("");
      setSendEmail(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to push notification");
    } finally {
      setIsSending(false);
    }
  };

  const isLoading = rawUsers === undefined;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Icons.loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-semibold">Loading customers canvas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans max-w-6xl">
      <div>
        <h2 className="text-2xl font-black font-headline text-slate-900 dark:text-white tracking-tight">
          Customer Directory
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          View registered customer accounts, view booking history, and send direct notifications
        </p>
      </div>

      <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold font-headline text-slate-900 dark:text-slate-50">
            Registered Customers
          </CardTitle>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Showing {uniqueCustomers.length} unique accounts
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {uniqueCustomers.length === 0 ? (
            <div className="text-center py-16">
              <Icons.users className="w-12 h-12 text-slate-350 dark:text-slate-700 mx-auto mb-4" />
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No registered customers found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {uniqueCustomers.map((customer: any) => (
                <div key={customer._id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                      {customer.name || customer.fullName || "Unnamed Customer"}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                      <Icons.mail className="w-3.5 h-3.5 text-slate-400" />
                      {customer.email}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                      <Icons.phone className="w-3.5 h-3.5 text-slate-400" />
                      {customer.phone || "-"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button
                      onClick={() => setNotifCustomer(customer)}
                      className="min-h-[38px] border-amber-200 dark:border-amber-900/40 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 bg-transparent rounded-xl flex items-center gap-1.5 text-xs font-bold"
                    >
                      <Icons.bell className="w-3.5 h-3.5" /> Notify
                    </Button>
                    <Button
                      onClick={() => setSelectedCustomer(customer)}
                      className="min-h-[38px] bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center gap-1.5 text-xs font-bold border-0"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Details Drawer/Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-2xl max-w-2xl w-full shadow-2xl space-y-5 animate-in fade-in-50 zoom-in-95 duration-100 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold font-headline text-slate-900 dark:text-white">Customer Profile Details</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedCustomer.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Icons.x className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
              <div>
                <span className="text-slate-400 uppercase font-black tracking-wider block">Full Name</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {selectedCustomer.name || selectedCustomer.fullName || "-"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-black tracking-wider block">Phone Number</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{selectedCustomer.phone || "-"}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 uppercase font-black tracking-wider block">Residential Address</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{selectedCustomer.address || "-"}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold font-headline text-slate-900 dark:text-white">Booking History</h4>
              {customerBookings.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 py-4 italic">No booking history recorded for this user.</p>
              ) : (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50/50 dark:bg-slate-950">
                      <TableRow>
                        <TableHead className="text-xs font-bold text-slate-400 uppercase">Service</TableHead>
                        <TableHead className="text-xs font-bold text-slate-400 uppercase">Date</TableHead>
                        <TableHead className="text-xs font-bold text-slate-400 uppercase">Status</TableHead>
                        <TableHead className="text-xs font-bold text-slate-400 uppercase text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customerBookings.map((b: any) => (
                        <TableRow key={b._id} className="border-b border-slate-100 dark:border-slate-850 text-xs">
                          <TableCell className="font-semibold">{b.serviceName}</TableCell>
                          <TableCell>{new Date(b.date).toLocaleDateString("en-IN")}</TableCell>
                          <TableCell>
                            <StatusBadge status={b.status} />
                          </TableCell>
                          <TableCell className="text-right font-bold">₹{b.amount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setSelectedCustomer(null)} className="rounded-xl min-h-[40px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-200 dark:hover:bg-slate-750">
                Close details
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Push Notification Dialog Modal */}
      {notifCustomer && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-2xl max-w-md w-full shadow-2xl space-y-4 animate-in fade-in-50 zoom-in-95 duration-100">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold font-headline text-slate-900 dark:text-white">Push Alert Notification</h3>
                <p className="text-xs text-slate-500 mt-0.5">Send alert to {notifCustomer.name || notifCustomer.fullName}</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifCustomer(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Icons.x className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendNotificationSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="notif-title" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Notification Title
                </Label>
                <Input
                  id="notif-title"
                  type="text"
                  placeholder="e.g. Schedule Confirmed"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="min-h-[44px] text-base border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notif-message" className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Message Content
                </Label>
                <Textarea
                  id="notif-message"
                  placeholder="Write message copy here..."
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  className="bg-white dark:bg-slate-955 border-slate-200 dark:border-slate-800 rounded-xl text-base"
                  rows={4}
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="send-email-box"
                  type="checkbox"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 border-slate-200 focus:ring-blue-500 bg-white dark:bg-slate-950"
                />
                <Label htmlFor="send-email-box" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Also deliver as Email Notification
                </Label>
              </div>

              <div className="flex gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNotifCustomer(null)}
                  className="flex-1 min-h-[44px] border-slate-200 dark:border-slate-800 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSending}
                  className="flex-1 min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
                >
                  {isSending ? (
                    <>
                      <Icons.loader className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Alert"
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
