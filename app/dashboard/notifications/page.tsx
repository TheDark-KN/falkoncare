"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TopBar } from "@/components/dashboard/top-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function NotificationsPage() {
  const notifications = useQuery(api.notifications.getMyNotifications) ?? [];
  const markAsRead = useMutation(api.notifications.markRead);
  const markAllReadMutation = useMutation(api.notifications.markAllRead);

  const handleMarkAllRead = async () => {
    try {
      await markAllReadMutation();
      toast.success("All notifications marked as read");
    } catch (e) {
      toast.error("Failed to mark notifications as read");
    }
  };

  const handleMarkRead = async (id: any, read: boolean) => {
    if (read) return;
    try {
      await markAsRead({ id });
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <TopBar title="Notifications" />

      <div className="p-6 max-w-2xl mx-auto">
        {notifications.length > 0 && (
          <div className="flex justify-end mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              className="text-xs font-bold text-slate-500 hover:text-slate-950 dark:hover:text-slate-100"
            >
              Mark all as read
            </Button>
          </div>
        )}

        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification: any) => (
              <Card
                key={notification._id}
                className={cn(
                  "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer transition-colors hover:shadow-sm rounded-xl overflow-hidden",
                  !notification.read && "border-blue-200 dark:border-blue-950 bg-blue-50/10 dark:bg-blue-950/5"
                )}
                onClick={() => handleMarkRead(notification._id, notification.read)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                        !notification.read
                          ? "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                      )}
                    >
                      <Icons.bell className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <h3
                          className={cn(
                            "font-bold text-sm truncate",
                            !notification.read
                              ? "text-slate-900 dark:text-white"
                              : "text-slate-500 dark:text-slate-400"
                          )}
                        >
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">
                        {new Date(notification.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icons.bell className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-bold font-headline text-slate-900 dark:text-white mb-2">
              No notifications
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              You&apos;re all caught up! We will notify you here about your bookings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
