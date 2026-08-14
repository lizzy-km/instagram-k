import { useState } from "react";
import type { ImgHTMLAttributes } from "react";

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "onError" | "onLoad"> {
  aspectRatio?: string;
  containerClassName?: string;
}

export function Image({ src, alt, aspectRatio = "1 / 1", containerClassName = "", className = "", ...props }: ImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(src ? "loading" : "error");

  return (
    <div
      className={`relative overflow-hidden bg-[var(--color-surface)] ${containerClassName}`}
      style={{ aspectRatio }}
    >
      {status === "loading" && <div className="absolute inset-0 animate-pulse bg-[var(--color-surface)]" />}

      {status === "error" ? (
        <div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-muted)]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M21,17V4H7V17H21M21,2A2,2 0 0,1 23,4V17A2,2 0 0,1 21,19H7C5.89,19 5,18.1 5,17V4A2,2 0 0,1 7,2H21M3,6V20H17V22H3A2,2 0 0,1 1,20V6H3M8.5,12.5L11,15.5L14.5,11L19,17H9L8.5,12.5Z" />
          </svg>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity ${status === "loaded" ? "opacity-100" : "opacity-0"} ${className}`}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          {...props}
        />
      )}
    </div>
  );
}
