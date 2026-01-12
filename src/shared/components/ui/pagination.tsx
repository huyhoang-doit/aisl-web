import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/shared/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"

interface PaginationProps {
  current: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  pageSizeOptions?: number[]
  showPageSizeSelector?: boolean
  className?: string
}

export function Pagination({
  current,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeSelector = true,
  className,
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  const startItem = (current - 1) * pageSize + 1
  const endItem = Math.min(current * pageSize, total)

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("ellipsis")
        pages.push(totalPages)
      } else if (current >= totalPages - 2) {
        pages.push(1)
        pages.push("ellipsis")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("ellipsis")
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i)
        }
        pages.push("ellipsis")
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="flex items-center gap-2">
        {showPageSizeSelector && onPageSizeChange && (
          <>
            <span className="text-sm text-muted-foreground">Hiển thị:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
        <span className="text-sm text-muted-foreground">
          Hiển thị {startItem} - {endItem} của {total}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(1)}
          disabled={current === 1}
          title="Trang đầu"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(current - 1)}
          disabled={current === 1}
          title="Trang trước"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getPageNumbers().map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-sm text-muted-foreground"
              >
                ...
              </span>
            )
          }

          const pageNum = page as number
          return (
            <Button
              key={pageNum}
              variant={current === pageNum ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </Button>
          )
        })}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(current + 1)}
          disabled={current >= totalPages}
          title="Trang sau"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onPageChange(totalPages)}
          disabled={current >= totalPages}
          title="Trang cuối"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

