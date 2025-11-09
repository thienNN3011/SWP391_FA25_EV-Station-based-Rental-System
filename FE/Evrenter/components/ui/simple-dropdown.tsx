"use client"

import { useState, useRef, useEffect } from "react"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SimpleDropdownProps {
  onChangeStatus: (status: "ACTIVE" | "INACTIVE" | "REJECTED", reason?: string) => void
}

export function SimpleDropdown({ onChangeStatus }: SimpleDropdownProps) {
  const [open, setOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [reason, setReason] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((prev) => !prev)}
        className="h-8 w-8 p-0"
      >
        <MoreHorizontal className="size-4" />
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border rounded-md shadow-lg z-[9999]"
          >
            <button
              className="block w-full text-left px-4 py-2 text-green-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                onChangeStatus("ACTIVE")
                setOpen(false)
              }}
            >
              Đang hoạt động
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-yellow-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                onChangeStatus("INACTIVE")
                setOpen(false)
              }}
            >
              Bị chặn
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                setShowModal(true)
                setOpen(false)
              }}
            >
              Từ chối
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-[10000]"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-96"
            >
              <h3 className="text-lg font-semibold mb-3">Nhập lý do từ chối tài khoản</h3>
              <Label htmlFor="reason" className="text-sm mb-1 block">Lý do</Label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do tại đây..."
                className="mb-4"
              />

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowModal(false)
                    setReason("")
                  }}
                >
                  Hủy
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onChangeStatus("REJECTED", reason)
                    setShowModal(false)
                    setReason("")
                  }}
                  disabled={!reason.trim()}
                >
                  Xác nhận
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
