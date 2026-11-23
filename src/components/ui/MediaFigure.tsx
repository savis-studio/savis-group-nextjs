import { cn } from "./cn";

export interface MediaFigureProps {
  src: string;
  /** Describe what the image shows; required. */
  alt: string;
  title?: string;
  caption?: string;
  variant?: "photo" | "diagram";
  width?: number;
  height?: number;
  className?: string;
}

/** Real photos with an overlay caption, or diagrams in a bordered frame. Swap <img> for next/image when the asset is local. */
export function MediaFigure({ src, alt, title, caption, variant = "photo", width, height, className }: MediaFigureProps) {
  return (
    <figure className={cn("sv-media", variant === "diagram" && "sv-media--diagram", className)}>
      <img src={src} alt={alt} width={width} height={height} loading="lazy" />
      {(title || caption) && (
        <figcaption className="sv-media__cap">
          {title && <b>{title}</b>}
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
