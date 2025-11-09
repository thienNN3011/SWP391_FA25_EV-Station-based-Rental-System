"use client"

import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

interface ReusableDropdownProps {
  trigger: ReactNode
  items: { label: string; icon?: ReactNode; onClick: () => void }[]
}

export default function ReusableDropdown({ trigger, items }: ReusableDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={5}>
        {items.map((item, idx) => (
          <DropdownMenuItem key={idx} className="flex items-center gap-2" onClick={item.onClick}>
            {item.icon} {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
