"use client"

import { ReactNode } from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu"

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

      {/* ⚠️ Portal đảm bảo dropdown hiển thị bên ngoài mọi container */}
      <DropdownMenuPortal>
        <DropdownMenuContent
          align="end"
          sideOffset={5}
          className="z-[9999] bg-white shadow-lg border rounded-md"
        >
          {items.map((item, idx) => (
            <DropdownMenuItem
              key={idx}
              className="flex items-center gap-2 cursor-pointer"
              onClick={item.onClick}
            >
              {item.icon} {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  )
}
