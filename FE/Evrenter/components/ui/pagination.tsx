"use client"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <button
        className="px-3 py-1 border rounded-md text-sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Trước
      </button>
      <span className="text-sm">
        Trang {currentPage} / {totalPages}
      </span>
      <button
        className="px-3 py-1 border rounded-md text-sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Tiếp
      </button>
    </div>
  )
}