import { cn } from "@/lib/utils"
import type { BookingStatus } from "@/lib/types"

interface StatusBadgeProps {
  status: BookingStatus
  className?: string
}

const statusStyles: Record<BookingStatus, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  confirmed: "bg-primary/10 text-primary border-primary/20",
  "in-progress": "bg-accent/10 text-accent border-accent/20",
  completed: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  rescheduled: "bg-purple-100 text-purple-800 dark:bg-purple-950/20 dark:text-purple-400 border-purple-200 dark:border-purple-800/20",
}

const statusLabels: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  "in-progress": "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  rescheduled: "Rescheduled",
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        statusStyles[status],
        className,
      )}
    >
      {statusLabels[status]}
    </span>
  )
}
