"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronDown, Check, X, Trash2 } from "lucide-react"

interface BulkActionsProps {
  selectedCount: number
  onAction: (action: string) => void
}

export function BulkActions({ selectedCount, onAction }: BulkActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleAction = (action: string) => {
    if (action === "delete") {
      setShowDeleteConfirm(true)
    } else {
      onAction(action)
    }
  }

  const confirmDelete = () => {
    onAction("delete")
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
        <span className="text-sm font-medium">{selectedCount} selected</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Bulk Actions
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleAction("activate")}>
              <Check className="mr-2 h-4 w-4" />
              Activate ({selectedCount})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction("deactivate")}>
              <X className="mr-2 h-4 w-4" />
              Deactivate ({selectedCount})
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction("delete")} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({selectedCount})
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Products</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCount} product{selectedCount > 1 ? "s" : ""}? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete {selectedCount} Product{selectedCount > 1 ? "s" : ""}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
