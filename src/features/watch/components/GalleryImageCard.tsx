import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Image } from "@/Components/ui";

interface GalleryImageCardProps {
  imageUrl: string;
  ownerId: string;
  ownerName: string;
  ownerAvatarUrl: string;
}

export function GalleryImageCard({ imageUrl, ownerId, ownerName, ownerAvatarUrl }: GalleryImageCardProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="group relative mb-3 break-inside-avoid overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-surface)]">
      {!loaded && <div className="aspect-[4/5] w-full animate-pulse bg-[var(--color-surface)]" />}
      <img
        src={imageUrl}
        alt=""
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full rounded-[var(--radius-md)] transition-opacity duration-[var(--duration-base)] ${
          loaded ? "opacity-100" : "hidden opacity-0"
        }`}
      />

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
