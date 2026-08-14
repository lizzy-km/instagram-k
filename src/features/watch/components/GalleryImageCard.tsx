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
    <div className="relative cursor-pointer h-auto flex flex-col justify-start items-start rounded-lg overflow-hidden">
      <Image src={imageUrl} alt="" aspectRatio="1 / 1" containerClassName="w-full rounded-lg" />

      <div className="w-full h-auto bg-[var(--color-bg-overlay)] backdrop-blur gap-2 absolute left-0 top-0 rounded-t-lg flex justify-start p-2 items-center">
        <NavLink to={`/${ownerId}`} className="relative rounded-full w-[26px] h-[26px]">
          <Image src={ownerAvatarUrl} alt="" aspectRatio="1 / 1" containerClassName="rounded-full" />
        </NavLink>
        <NavLink to={`/${ownerId}`} className="cursor-pointer text-[12px] tracking-wide text-white">
          {ownerName}
        </NavLink>
      </div>
    </div>
  );
}
