"use client";

import { useQuery, useMutation } from "convex/react";

// Force dynamic rendering to prevent static generation issues with Convex
export const dynamic = 'force-dynamic';
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Icons } from "@/components/icons";
import type { Id, Doc } from "@/convex/_generated/dataModel";

export default function AdminBookingsPage() {
  const bookings = useQuery(api.bookings.get);
  const updateStatus = useMutation(api.bookings.updateStatus);

  if (bookings === undefined) {
    return <div className="flex justify-center p-8"><Icons.loader className="animate-spin w-8 h-8 text-primary" /></div>;
  }

  const handleStatusChange = async (id: Id<"bookings">, newStatus: string) => {
    const validStatuses = ["pending", "confirmed", "in-progress", "completed", "cancelled"] as const;
    type ValidStatus = typeof validStatuses[number];
    if (!validStatuses.includes(newStatus as ValidStatus)) return;
    await updateStatus({ id, status: newStatus as ValidStatus });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No bookings found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking: Doc<"bookings">) => (
                  <TableRow key={booking._id}>
                    <TableCell className="font-medium">{booking.userId}</TableCell>
                    <TableCell>{booking.serviceName}</TableCell>
                    <TableCell>
                      {new Date(booking.date).toLocaleDateString()} at {booking.time}
                    </TableCell>
                    <TableCell>₹{booking.amount}</TableCell>
                    <TableCell>
                      <StatusBadge status={booking.status} />
                    </TableCell>
                    <TableCell className="flex gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <Button size="sm" onClick={() => handleStatusChange(booking._id, 'confirmed')} className="h-8">
                            Confirm
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleStatusChange(booking._id, 'cancelled')} className="h-8">
                            Cancel
                          </Button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button size="sm" variant="secondary" onClick={() => handleStatusChange(booking._id, 'completed')} className="h-8">
                          Mark Complete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
