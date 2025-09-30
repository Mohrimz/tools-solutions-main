import { Badge } from "./badge"

interface StatusBadgeProps {
  isActive: boolean
}

export function StatusBadge({ isActive }: StatusBadgeProps) {
  return (
    <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
      {isActive ? "Active" : "Inactive"}
    </Badge>
  )
}
