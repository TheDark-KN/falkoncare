"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { useState, useMemo } from "react";
import type { Id } from "@/convex/_generated/dataModel";

type UserOption = {
  _id: Id<"users">;
  name: string;
  email: string;
};

export default function AdminNotificationsPage() {
  const rawUsers = useQuery(api.admin.getAllUsers);
  const users = useMemo(() => rawUsers ?? [], [rawUsers]);
  const sendToUser = useMutation(api.admin.sendNotificationToUser);
  const broadcastToAll = useMutation(api.admin.sendNotificationToAll);

  // Section A: Single User state
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [type, setType] = useState("system");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [isSendingSingle, setIsSendingSingle] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Section B: Broadcast state
  const [bcType, setBcType] = useState("promo");
  const [bcTitle, setBcTitle] = useState("");
  const [bcMessage, setBcMessage] = useState("");
  const [bcSendEmail, setBcSendEmail] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [showConfirmBroadcast, setShowConfirmBroadcast] = useState(false);

  const filteredSearchUsers = useMemo(() => {
    if (!userSearch.trim()) return [];
    return users
      .filter(
        (u: any) =>
          (u.name || "").toLowerCase().includes(userSearch.toLowerCase()) ||
          (u.email || "").toLowerCase().includes(userSearch.toLowerCase())
      )
      .slice(0, 5);
  }, [users, userSearch]);

  const handleSendSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      toast.error("Please select a target recipient user");
      return;
    }
    if (!title.trim() || title.length > 100) {
      toast.error("Title must be between 1 and 100 characters");
      return;
    }
    if (!message.trim() || message.length > 500) {
      toast.error("Message must be between 1 and 500 characters");
      return;
    }

    setIsSendingSingle(true);
    try {
      await sendToUser({
        userId: selectedUser._id,
        type,
        title: title.trim(),
        message: message.trim(),
        sendEmail,
      });
      toast.success("Notification sent successfully!");
      setTitle("");
      setMessage("");
      setSelectedUser(null);
      setUserSearch("");
      setSendEmail(false);
    } catch (err) {
      toast.error("Failed to send notification");
    } finally {
      setIsSendingSingle(false);
    }
  };

  const handleBroadcast = async () => {
    if (!bcTitle.trim() || bcTitle.length > 100) {
      toast.error("Broadcast title must be between 1 and 100 characters");
      return;
    }
    if (!bcMessage.trim() || bcMessage.length > 500) {
      toast.error("Broadcast message must be between 1 and 500 characters");
      return;
    }

    setIsBroadcasting(true);
    setShowConfirmBroadcast(false);
    try {
      await broadcastToAll({
        type: bcType,
        title: bcTitle.trim(),
        message: bcMessage.trim(),
        sendEmail: bcSendEmail,
      });
      toast.success(`Broadcast sent successfully to all ${users.length} users!`);
      setBcTitle("");
      setBcMessage("");
      setBcSendEmail(false);
    } catch (err) {
      toast.error("Failed to execute broadcast");
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-4xl">
      <div>
        <h2 className="text-2xl font-black font-headline text-slate-900 dark:text-white tracking-tight">
          Dispatch Notifications
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Send in-app alerts and offline email updates directly to customers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section A: Send to Specific User */}
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8">
          <CardHeader className="px-0 pt-0 pb-4">
            <CardTitle className="text-lg font-bold font-headline text-slate-900 dark:text-slate-50">
              Send to Specific User
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Send an alert to a single customer's bell and inbox
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <form onSubmit={handleSendSingle} className="space-y-4">
              <div className="space-y-1.5 relative">
                <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Search Recipient
                </Label>
                {selectedUser ? (
                  <div className="flex items-center justify-between bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 p-3 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedUser.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{selectedUser.email}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setSelectedUser(null)}
                      className="text-xs font-bold text-red-500 hover:text-red-600 hover:bg-transparent"
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <>
                    <Input
                      type="text"
                      placeholder="Type name or email..."
                      value={userSearch}
                      onChange={(e) => {
                        setUserSearch(e.target.value);
                        setShowSearchDropdown(true);
                      }}
                      onFocus={() => setShowSearchDropdown(true)}
                      className="min-h-[44px] text-base border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl"
                    />
                    {showSearchDropdown && filteredSearchUsers.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-25 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
                        {filteredSearchUsers.map((u) => (
                          <div
                            key={u._id}
                            onClick={() => {
                              setSelectedUser(u as any);
                              setShowSearchDropdown(false);
                            }}
                            className="p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 text-left"
                          >
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{u.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{u.email}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Alert Type
                </Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="min-h-[44px] border-slate-200 dark:border-slate-800 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <SelectItem value="system">System Notification</SelectItem>
                    <SelectItem value="booking_update">Booking Update</SelectItem>
                    <SelectItem value="reminder">Reminder Alert</SelectItem>
                    <SelectItem value="promo">Promotional Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Notification Title
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. Schedule confirmed!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  className="min-h-[44px] text-base border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Alert Message
                </Label>
                <textarea
                  rows={4}
                  placeholder="Type message content here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={500}
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-slate-950 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center gap-2.5 py-1">
                <input
                  type="checkbox"
                  id="sendEmail"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="w-4.5 h-4.5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded focus:ring-blue-500"
                />
                <Label htmlFor="sendEmail" className="text-xs font-bold text-slate-500 dark:text-slate-400 cursor-pointer">
                  Also dispatch offline email notification
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isSendingSingle || !selectedUser || !title || !message}
                className="w-full min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
              >
                {isSendingSingle ? (
                  <>
                    <Icons.loader className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Notification"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Section B: Broadcast to All Users */}
        <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8">
          <CardHeader className="px-0 pt-0 pb-4">
            <CardTitle className="text-lg font-bold font-headline text-slate-900 dark:text-slate-50">
              Broadcast to All Users
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Transmit system announcement or promo to all {users.length} registered accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Broadcast Type
              </Label>
              <Select value={bcType} onValueChange={setBcType}>
                <SelectTrigger className="min-h-[44px] border-slate-200 dark:border-slate-800 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <SelectItem value="promo">Promotional Update</SelectItem>
                  <SelectItem value="system">System Announcement</SelectItem>
                  <SelectItem value="reminder">Scheduled Maintenance Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Broadcast Title
              </Label>
              <Input
                type="text"
                placeholder="e.g. Diwali Cleaning Special Offer!"
                value={bcTitle}
                onChange={(e) => setBcTitle(e.target.value)}
                maxLength={100}
                className="min-h-[44px] text-base border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Broadcast Message
              </Label>
              <textarea
                rows={4}
                placeholder="Type broadcast message details..."
                value={bcMessage}
                onChange={(e) => setBcMessage(e.target.value)}
                maxLength={500}
                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-slate-950 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex items-center gap-2.5 py-1">
              <input
                type="checkbox"
                id="bcSendEmail"
                checked={bcSendEmail}
                onChange={(e) => setBcSendEmail(e.target.checked)}
                className="w-4.5 h-4.5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded focus:ring-blue-500"
              />
              <Label htmlFor="bcSendEmail" className="text-xs font-bold text-slate-500 dark:text-slate-400 cursor-pointer">
                Also dispatch offline email notification
              </Label>
            </div>

            <Button
              type="button"
              disabled={isBroadcasting || !bcTitle || !bcMessage}
              onClick={() => setShowConfirmBroadcast(true)}
              className="w-full min-h-[44px] bg-red-650 hover:bg-red-750 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/10"
            >
              {isBroadcasting ? (
                <>
                  <Icons.loader className="w-4 h-4 animate-spin" />
                  Broadcasting...
                </>
              ) : (
                `⚠️ Broadcast to ALL ${users.length} Users`
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Modal */}
      {showConfirmBroadcast && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-2xl max-w-sm w-full shadow-2xl space-y-4 animate-in fade-in-50 zoom-in-95 duration-100 text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center text-red-500 dark:text-red-400 mx-auto mb-2">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-headline text-slate-900 dark:text-white">Confirm Broadcast</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              This action will deliver the notification to <span className="font-bold text-slate-900 dark:text-white">{users.length}</span> active customer accounts. Are you sure you want to proceed?
            </p>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmBroadcast(false)}
                className="flex-1 min-h-[44px] border-slate-200 dark:border-slate-800 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleBroadcast}
                className="flex-1 min-h-[44px] bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl"
              >
                Yes, Send All
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
