import { cn } from "@/lib/utils"
import { getProductImageUrl } from "@/lib/image-upload"

interface ImagePlaceholderProps {
  src: string
  alt: string
  className?: string
  aspectRatio?: "square" | "video" | "portrait"
}

export function ImagePlaceholder({ src, alt, className, aspectRatio = "square" }: ImagePlaceholderProps) {
  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
  }

  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-muted", aspectClasses[aspectRatio], className)}>
      <img 
        src={getProductImageUrl(src)} 
        alt={alt} 
        className="h-full w-full object-cover" 
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/placeholder.svg'
        }}
      />
    </div>
  )
}
