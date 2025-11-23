"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: number | string
  color: "green" | "red" | "blue" | "purple"
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  formatValue?: (value: number | string) => string
}

const colorClasses = {
  green: {
    bg: "bg-green-50 dark:bg-green-950",
    text: "text-green-600 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
    icon: "text-green-500"
  },
  red: {
    bg: "bg-red-50 dark:bg-red-950",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
    icon: "text-red-500"
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    icon: "text-blue-500"
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
    icon: "text-purple-500"
  }
}

export function MetricCard({ 
  title, 
  value, 
  color, 
  icon, 
  trend,
  formatValue 
}: MetricCardProps) {
  const colors = colorClasses[color]
  const displayValue = formatValue && typeof value === 'number' 
    ? formatValue(value) 
    : value.toLocaleString()

  return (
    <Card className={cn("border-2", colors.border, colors.bg)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className={cn("h-4 w-4", colors.icon)}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", colors.text)}>
          {displayValue}
        </div>
        {trend && (
          <div className="flex items-center mt-1 text-xs text-muted-foreground">
            {trend.isPositive ? (
              <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <ArrowDownIcon className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={trend.isPositive ? "text-green-600" : "text-red-600"}>
              {Math.abs(trend.value)}%
            </span>
            <span className="ml-1">so với kỳ trước</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
