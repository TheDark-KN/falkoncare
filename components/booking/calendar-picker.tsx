"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateCalendarDays, getMonthName } from "@/lib/calendar-utils"

interface CalendarPickerProps {
  onDateSelect: (date: string) => void
  selectedDate?: string
}

export function CalendarPicker({ onDateSelect, selectedDate }: CalendarPickerProps) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  const days = generateCalendarDays(currentYear, currentMonth)
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleDateClick = (date: Date) => {
    onDateSelect(date.toISOString().split("T")[0])
  }

  return (
    <div className="w-full p-4 glass-effect overflow-hidden relative rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 dark:from-black/40 dark:to-black/10 pointer-events-none" />
      <div className="relative z-10">
        <div className="mb-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            {getMonthName(currentMonth)} {currentYear}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth} className="h-8 w-8 p-0 bg-transparent">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextMonth} className="h-8 w-8 p-0 bg-transparent">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => day.isAvailable && handleDateClick(day.date)}
              disabled={!day.isAvailable && day.isCurrentMonth}
              className={`
                aspect-square rounded-lg text-sm font-medium flex items-center justify-center relative
                transition-all duration-200 hover:scale-110
                ${!day.isCurrentMonth ? "text-muted-foreground bg-muted/30" : ""}
                ${day.isToday ? "ring-2 ring-primary" : ""}
                ${day.isAvailable && day.isCurrentMonth
                  ? "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer"
                  : day.isCurrentMonth
                    ? "bg-destructive/10 text-destructive cursor-not-allowed"
                    : ""
                }
                ${selectedDate === day.date.toISOString().split("T")[0] ? "bg-primary text-primary-foreground ring-2 ring-primary scale-110" : ""}
              `}
            >
              {day.dayOfMonth}
              {day.isAvailable && day.isCurrentMonth && (
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-muted-foreground space-y-1 pt-3 border-t border-border">
        <p className="flex items-center gap-2">
          <span className="w-3 h-3 bg-primary/10 rounded border border-primary"></span>
          Available
        </p>
        <p className="flex items-center gap-2">
          <span className="w-3 h-3 bg-destructive/10 rounded border border-destructive"></span>
          Not Available
        </p>
        <p className="flex items-center gap-2">
          <span className="w-3 h-3 ring-2 ring-primary rounded"></span>
          Today
        </p>
      </div>
      </div>
    </div>
  )
}
