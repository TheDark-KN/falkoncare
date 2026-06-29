"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import type { Id } from "@/convex/_generated/dataModel";

type UserRow = any;

const ITEMS_PER_PAGE = 20;

export default function AdminUsersPage() {
  const users = useQuery(api.admin.getAllUsers);
  const changeRole = useMutation(api.admin.updateUserRole);
  const deleteUser = useMutation(api.admin.deleteUser);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const isLoading = users === undefined;

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    const query = search.trim().toLowerCase();
    if (!query) return users;

    return users.filter(
      (u: UserRow) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.phone.toLowerCase().includes(query)
    );
  }, [users, search]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const handleRoleChange = async (userId: Id<"users">, newRole: "admin" | "customer" | "user" | "staff") => {
    try {
      await changeRole({ userId, role: newRole });
      toast.success("User role updated successfully");
    } catch (e) {
      toast.error("Failed to update user role");
    }
  };

  const handleSoftDelete = async (userId: Id<"users">) => {
    if (!window.confirm("Are you sure you want to delete this user? This will soft-delete their profile.")) {
      return;
    }
    try {
      await deleteUser({ userId });
      toast.success("User deleted successfully");
    } catch (e) {
      toast.error("Failed to delete user");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Icons.loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 font-semibold">Loading users database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black font-headline text-slate-900 dark:text-white tracking-tight">
            User Management
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse, manage, and configure system permissions for customers and staff
          </p>
        </div>
      </div>

      <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Icons.search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 min-h-[40px] text-sm bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Found {filteredUsers.length} users
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/20 hover:bg-transparent">
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400 pl-6">User</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400">Phone</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400">Role</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400">Joined</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400 text-center">Bookings</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-400 pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-sm text-slate-500 dark:text-slate-400">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user: UserRow) => (
                    <TableRow key={user._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                              {user.name}
                            </div>
                            <div className="text-xs text-slate-400">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        {user.phone}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(val) => handleRoleChange(user._id, val as any)}
                        >
                          <SelectTrigger className="w-[120px] min-h-[36px] h-9 text-xs border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                            <SelectItem value="customer">Customer</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500 dark:text-slate-400">
                        {new Date(user._creationTime).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-center font-bold text-sm text-slate-700 dark:text-slate-300">
                        {user.bookingCount}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSoftDelete(user._id)}
                            className="w-8 h-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 h-9 text-xs border-slate-200 dark:border-slate-800 rounded-lg"
              >
                Previous
              </Button>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 h-9 text-xs border-slate-200 dark:border-slate-800 rounded-lg"
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
