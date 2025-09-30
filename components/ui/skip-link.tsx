"use client"

import { Button } from "./button"

export function SkipLink() {
  const skipToMain = () => {
    const main = document.querySelector("main")
    if (main) {
      main.focus()
      main.scrollIntoView()
    }
  }

  return (
    <Button
      variant="outline"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-transparent"
      onClick={skipToMain}
    >
      Skip to main content
    </Button>
  )
}
