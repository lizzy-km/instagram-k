import { Image, Button } from "@/Components/ui";
import { Icon } from "@/Components/icons/Icon";
import { mdiSendVariantOutline } from "@/Components/icons/paths";

interface ProfileHeaderProps {
  userName: string;
  nickName: string | null;
  avatarUrl: string;
  coverUrl: string;
  isOwnProfile: boolean;
  onSendMessage: () => void;
}

export function ProfileHeader({ userName, nickName, avatarUrl, coverUrl, isOwnProfile, onSendMessage }: ProfileHeaderProps) {
  return (
    <div className="w-full">
      <Image src={coverUrl} alt="" aspectRatio="3 / 1" containerClassName="w-full" />

      <div className="mx-auto flex max-w-2xl flex-col gap-3 px-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="-mt-10 flex items-end gap-4 sm:-mt-12">
          <Image
            src={avatarUrl}
            alt={userName}
            aspectRatio="1 / 1"
            containerClassName="w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-4 ring-[var(--color-bg)] shrink-0"
          />
          <div className="pb-1">
            <h1 className="text-lg font-bold text-[var(--color-text)] sm:text-xl">{userName}</h1>
            {nickName && <p className="text-sm text-[var(--color-text-faint)]">@{nickName}</p>}
          </div>
        </div>

        {!isOwnProfile && (
          <Button variant="secondary" onClick={onSendMessage} className="self-start sm:self-auto">
            <Icon path={mdiSendVariantOutline} size={0.8} />
            Message
          </Button>
        )}
      </div>
    </div>
  );
}
