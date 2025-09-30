import type { ReactNode } from "react"

interface ProductGridProps {
  children: ReactNode
}

export function ProductGrid({ children }: ProductGridProps) {
  return <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{children}</div>
}
