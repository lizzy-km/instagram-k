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
    <div className="flex items-center gap-3">
      <NavLink to={`/${UID}`} className="relative shrink-0">
        <Image
          src={userProfilePhotoUrl || userAvatar}
          alt={name}
          aspectRatio="1 / 1"
          containerClassName="w-10 h-10 rounded-full"
        />
        {status === "online" && (
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[var(--color-bg-elevated)] bg-[var(--color-online)]" />
        )}
      </NavLink>
      <NavLink to={`/${UID}`} className="flex flex-col leading-tight">
        <span className="text-sm font-semibold text-[var(--color-text)]">{name}</span>
        <time dateTime={new Date(uploadedAtMs).toISOString()} className="text-xs text-[var(--color-text-faint)]">
          {timeLabel}
        </time>
      </NavLink>
    </div>
  );
}
