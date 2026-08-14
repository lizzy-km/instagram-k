import { NavLink } from "react-router-dom";
import { Image } from "@/Components/ui";

interface NameCardProps {
  userAvatar: string;
  UID: string;
  userProfilePhotoUrl: string | null;
  name: string;
  uploadedAtMs: number;
  timeLabel: string;
  status: "online" | "offline" | null;
}

export function NameCard({
  userAvatar,
  UID,
  userProfilePhotoUrl,
  name,
  uploadedAtMs,
  timeLabel,
  status,
}: NameCardProps) {
  return (
    <div className="absolute bottom-2 left-0 w-full p-2 h-[55px] flex justify-start items-center">
      <div className="w-auto h-full gap-2 flex justify-center items-center">
        <NavLink to={`/${UID}`} className="relative w-[40px] h-[40px] justify-center items-center">
          <Image
            src={userProfilePhotoUrl || userAvatar}
            alt={name}
            aspectRatio="1 / 1"
            containerClassName="rounded-full cursor-pointer"
          />
        </NavLink>
        <NavLink
          to={`/${UID}`}
          className="flex-col cursor-pointer rounded-br px-2 h-full min-w-[100px] w-auto flex justify-start items-start tracking-wide text-base"
        >
          <p className="relative flex gap-2">
            {name}
            {status === "online" && (
              <span className="absolute -right-3 top-[45%] flex rounded-full p-[3px] bg-[var(--color-online)]" />
            )}
          </p>
          <time dateTime={new Date(uploadedAtMs).toISOString()} className="opacity-75 text-[12px]">
            {timeLabel}
          </time>
        </NavLink>
      </div>
    </div>
  );
}
