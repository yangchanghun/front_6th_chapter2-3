// src/shared/ui/card/card-content.tsx
import React, { forwardRef } from "react"

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className || ""}`} {...props} />
))

CardContent.displayName = "CardContent"
