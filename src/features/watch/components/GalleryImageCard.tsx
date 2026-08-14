import { NavLink } from "react-router-dom";
import { Image } from "@/Components/ui";

interface GalleryImageCardProps {
  imageUrl: string;
  ownerId: string;
  ownerName: string;
  ownerAvatarUrl: string;
}

export function GalleryImageCard({ imageUrl, ownerId, ownerName, ownerAvatarUrl }: GalleryImageCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-[var(--radius-md)]">
      <Image src={imageUrl} alt="" aspectRatio="1 / 1" containerClassName="w-full" />

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
