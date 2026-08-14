import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Image } from "@/Components/ui";

interface GalleryImageCardProps {
  imageUrl: string;
  ownerId: string;
  ownerName: string;
  ownerAvatarUrl: string;
  aspectRatio: string;
}

export function GalleryImageCard({ imageUrl, ownerId, ownerName, ownerAvatarUrl, aspectRatio }: GalleryImageCardProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  return (
    <div className="group relative mb-3 break-inside-avoid overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-surface)]">
      {status !== "loaded" && (
        <div className="w-full animate-pulse bg-[var(--color-surface)]" style={{ aspectRatio }} />
      )}

      {status === "error" ? (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-[var(--color-text-faint)]"
          style={{ aspectRatio }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M21,17V4H7V17H21M21,2A2,2 0 0,1 23,4V17A2,2 0 0,1 21,19H7C5.89,19 5,18.1 5,17V4A2,2 0 0,1 7,2H21M3,6V20H17V22H3A2,2 0 0,1 1,20V6H3M8.5,12.5L11,15.5L14.5,11L19,17H9L8.5,12.5Z" />
          </svg>
          <span className="text-xs">Image unavailable</span>
        </div>
      ) : (
        <img
          src={imageUrl}
          alt=""
          loading="lazy"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={`w-full rounded-[var(--radius-md)] transition-opacity duration-[var(--duration-base)] ${
            status === "loaded" ? "absolute inset-0 h-full opacity-100" : "hidden opacity-0"
          }`}
        />
      )}

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent p-2.5 opacity-0 transition-opacity duration-[var(--duration-fast)] group-hover:opacity-100">
        <NavLink to={`/${ownerId}`} className="shrink-0">
          <Image src={ownerAvatarUrl} alt="" aspectRatio="1 / 1" containerClassName="w-6 h-6 rounded-full" />
        </NavLink>
        <NavLink to={`/${ownerId}`} className="truncate text-xs font-medium text-white">
          {ownerName}
        </NavLink>
      </div>
    </div>
  );
}
