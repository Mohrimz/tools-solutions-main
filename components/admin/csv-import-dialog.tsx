"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { MergeStrategy } from "@/lib/types"

interface CSVImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (csvText: string, strategy: MergeStrategy) => void
}

export function CSVImportDialog({ open, onOpenChange, onImport }: CSVImportDialogProps) {
  const [strategy, setStrategy] = useState<MergeStrategy>("append")

  const handleImport = () => {
    const csvText = (window as any).pendingCsvImport
    if (csvText) {
      onImport(csvText, strategy)
      delete (window as any).pendingCsvImport
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" aria-describedby="csv-import-description">
        <DialogHeader>
          <DialogTitle>Import Products from CSV</DialogTitle>
          <DialogDescription id="csv-import-description">Choose how to handle the imported products</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium">Import Strategy</Label>
            <RadioGroup
              value={strategy}
              onValueChange={(value) => setStrategy(value as MergeStrategy)}
              className="mt-3"
            >
              <Card className="cursor-pointer hover:bg-muted/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="append" id="append" />
                    <Label htmlFor="append" className="cursor-pointer">
                      <CardTitle className="text-sm">Append Products</CardTitle>
                    </Label>
                  </div>
                  <CardDescription className="text-xs">
                    Add new products to the existing catalog. Existing products remain unchanged.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:bg-muted/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="replace" id="replace" />
                    <Label htmlFor="replace" className="cursor-pointer">
                      <CardTitle className="text-sm">Replace Catalog</CardTitle>
                    </Label>
                  </div>
                  <CardDescription className="text-xs">
                    Replace the entire product catalog with imported products. This will remove all existing products.
                  </CardDescription>
                </CardHeader>
              </Card>
            </RadioGroup>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">CSV Format Requirements:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Required columns: name, sku, category, priceLKR, stock</li>
              <li>• Optional columns: description, isActive, rating, images</li>
              <li>• Images should be separated by | (pipe) character</li>
              <li>• Boolean values: true/false (case insensitive)</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport}>Import Products</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
