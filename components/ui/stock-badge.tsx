import { Badge } from "./badge"
import { getStockStatus, getStockBadgeVariant, getStockLabel } from "@/lib/utils"

interface StockBadgeProps {
  stock: number
}

export function StockBadge({ stock }: StockBadgeProps) {
  const status = getStockStatus(stock)
  const variant = getStockBadgeVariant(status)
  const label = getStockLabel(status)

  return (
    <Badge variant={variant} className="text-xs">
      {label}
    </Badge>
  )
}
