"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

// Types
export interface LocalBooking {
  id: string;
  serviceName: string;
  date: number; // timestamp
  time: string;
  amount: number;
  address: string;
  tankSize?: string;
  tankType?: string;
  paymentMethod: "wallet" | "cash";
  userId: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled" | "rescheduled";
  createdAt: string;
}

export interface LocalUser {
  externalId: string;
  email: string;
  fullName: string;
  walletBalance: number;
  address?: string;
  phoneNumber?: string;
}

// Booking Management
export class LocalBookingManager {
  private static BOOKINGS_KEY = "user_bookings";
  private static WALLET_KEY = "user_wallet_balance";
  private static USER_KEY = "user_data";

  // Bookings
  static getAllBookings(): LocalBooking[] {
    if (typeof window === "undefined") return [];
    try {
      const bookings = localStorage.getItem(this.BOOKINGS_KEY);
      return bookings ? JSON.parse(bookings) : [];
    } catch (error) {
      console.error("Error getting bookings:", error);
      return [];
    }
  }

  static getUserBookings(userId: string): LocalBooking[] {
    return this.getAllBookings().filter(booking => booking.userId === userId);
  }

  static addBooking(booking: Omit<LocalBooking, "id" | "createdAt" | "status">): LocalBooking {
    const newBooking: LocalBooking = {
      ...booking,
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const bookings = this.getAllBookings();
    bookings.push(newBooking);

    if (typeof window !== "undefined") {
      localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
    }

    return newBooking;
  }

  static updateBookingStatus(bookingId: string, status: LocalBooking["status"]): boolean {
    const bookings = this.getAllBookings();
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);

    if (bookingIndex === -1) return false;

    bookings[bookingIndex].status = status;

    if (typeof window !== "undefined") {
      localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
    }

    return true;
  }

  static deleteBooking(bookingId: string): boolean {
    const bookings = this.getAllBookings();
    const filteredBookings = bookings.filter(b => b.id !== bookingId);

    if (bookings.length === filteredBookings.length) return false;

    if (typeof window !== "undefined") {
      localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(filteredBookings));
    }

    return true;
  }

  // Wallet Management
  static getWalletBalance(): number {
    if (typeof window === "undefined") return 1000;
    try {
      const balance = localStorage.getItem(this.WALLET_KEY);
      return balance ? parseInt(balance) : 1000; // Default balance
    } catch (error) {
      console.error("Error getting wallet balance:", error);
      return 1000;
    }
  }

  static updateWalletBalance(amount: number): number {
    const currentBalance = this.getWalletBalance();
    const newBalance = currentBalance + amount;

    if (newBalance < 0) {
      toast.error("Insufficient balance");
      return currentBalance;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(this.WALLET_KEY, newBalance.toString());
    }

    return newBalance;
  }

  static deductFromWallet(amount: number): boolean {
    const currentBalance = this.getWalletBalance();

    if (currentBalance < amount) {
      toast.error("Insufficient wallet balance");
      return false;
    }

    this.updateWalletBalance(-amount);
    return true;
  }

  static addToWallet(amount: number): number {
    return this.updateWalletBalance(amount);
  }

  // User Data Management
  static saveUserData(userData: LocalUser): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
    }
  }

  static getUserData(): LocalUser | null {
    if (typeof window === "undefined") return null;
    try {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  }

  // Booking Statistics
  static getBookingStats(userId: string) {
    const bookings = this.getUserBookings(userId);

    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === "pending").length,
      confirmed: bookings.filter(b => b.status === "confirmed").length,
      inProgress: bookings.filter(b => b.status === "in-progress").length,
      completed: bookings.filter(b => b.status === "completed").length,
      cancelled: bookings.filter(b => b.status === "cancelled").length,
      totalSpent: bookings
        .filter(b => b.status === "completed" && b.paymentMethod === "wallet")
        .reduce((sum, b) => sum + b.amount, 0),
    };
  }

  // Data Export/Import for future migration
  static exportData() {
    return {
      bookings: this.getAllBookings(),
      walletBalance: this.getWalletBalance(),
      userData: this.getUserData(),
      exportedAt: new Date().toISOString(),
    };
  }

  static importData(data: any) {
    if (typeof window === "undefined") return false;

    try {
      if (data.bookings) {
        localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(data.bookings));
      }
      if (data.walletBalance) {
        localStorage.setItem(this.WALLET_KEY, data.walletBalance.toString());
      }
      if (data.userData) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(data.userData));
      }
      return true;
    } catch (error) {
      console.error("Error importing data:", error);
      return false;
    }
  }

  // Clear all data (for logout/reset)
  static clearAllData() {
    if (typeof window === "undefined") return;

    localStorage.removeItem(this.BOOKINGS_KEY);
    localStorage.removeItem(this.WALLET_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Sync with Convex (for future use when Convex is fixed)
  static async syncWithConvex() {
    // Placeholder for future Convex integration
    return false;
  }
}

// Utility functions
export const formatBookingDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatBookingTime = (time: string) => {
  return time;
};

export const getBookingStatusColor = (status: LocalBooking["status"]) => {
  switch (status) {
    case "pending":
      return "text-yellow-600 bg-yellow-100";
    case "confirmed":
      return "text-blue-600 bg-blue-100";
    case "in-progress":
      return "text-orange-600 bg-orange-100";
    case "completed":
      return "text-green-600 bg-green-100";
    case "cancelled":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const getBookingStatusLabel = (status: LocalBooking["status"]) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "in-progress":
      return "In Progress";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return "Unknown";
  }
};

// React Hook for using local booking manager
export const useLocalBookings = (userId: string) => {
  const [bookings, setBookings] = useState<LocalBooking[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && userId) {
      setBookings(LocalBookingManager.getUserBookings(userId));
      setWalletBalance(LocalBookingManager.getWalletBalance());
      setLoading(false);
    }
  }, [userId]);

  const addBooking = (booking: Omit<LocalBooking, "id" | "createdAt" | "status">) => {
    const newBooking = LocalBookingManager.addBooking(booking);
    setBookings(prev => [...prev, newBooking]);
    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: LocalBooking["status"]) => {
    const success = LocalBookingManager.updateBookingStatus(bookingId, status);
    if (success) {
      setBookings(prev =>
        prev.map(b => b.id === bookingId ? { ...b, status } : b)
      );
    }
    return success;
  };

  const updateWallet = (amount: number) => {
    const newBalance = LocalBookingManager.updateWalletBalance(amount);
    setWalletBalance(newBalance);
    return newBalance;
  };

  return {
    bookings,
    walletBalance,
    loading,
    addBooking,
    updateBookingStatus,
    updateWallet,
    stats: LocalBookingManager.getBookingStats(userId),
  };
};
