"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Calendar interface for better type safety
interface CalendarProps {
  className?: string
  selected?: Date | Date[] | undefined
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  defaultMonth?: Date
}

function Calendar({
  className,
  selected,
  onSelect,
  disabled,
  defaultMonth
}: CalendarProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    Array.isArray(selected) ? selected[0] : selected
  )
  const [currentMonth, setCurrentMonth] = React.useState<Date>(defaultMonth || new Date())

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    onSelect?.(date)
  }

  // Generate calendar days
  const generateDays = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()

    const startingDayOfWeek = firstDay.getDay()
    const days = []

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    // Fill remaining cells to complete 6-week grid (42 cells total)
    const totalCells = 42
    const remainingCells = totalCells - days.length
    for (let i = 0; i < remainingCells; i++) {
      days.push(null)
    }

    return days
  }

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    if (!selectedDate) return false
    return date.toDateString() === selectedDate.toDateString()
  }

  const isDisabled = (date: Date) => {
    return disabled ? disabled(date) : false
  }

  return (
    <div className={cn("w-fit p-3 bg-background rounded-lg border shadow-sm", className)}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4 px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
            setCurrentMonth(prevMonth)
          }}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        <div className="text-sm font-medium">
          {formatMonthYear(currentMonth)}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
            setCurrentMonth(nextMonth)
          }}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Weekday headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-sm font-medium text-muted-foreground p-2 text-center"
          >
            {day}
          </div>
        ))}

        {/* Calendar days grid */}
        {generateDays(currentMonth).map((date, index) => (
          <div key={index}>
            {date ? (
              <Button
                variant={isSelected(date) ? "default" : "ghost"}
                className={cn(
                  "aspect-square h-8 w-8 p-0",
                  isSelected(date) && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  isToday(date) && "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground",
                  isDisabled(date) && "text-muted-foreground opacity-50 cursor-not-allowed",
                  !isSelected(date) && !isToday(date) && "hover:bg-accent"
                )}
                onClick={() => !isDisabled(date) && handleDateSelect(date)}
                disabled={isDisabled(date)}
              >
                <span className="text-sm">{date.getDate()}</span>
              </Button>
            ) : (
              <div className="aspect-square h-8 w-8 p-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export { Calendar }