import { Image } from "@/Components/ui";
import { Icon } from "@/Components/icons/Icon";
import { mdiSendVariantOutline } from "@/Components/icons/paths";
import { useIsDesktop, useIsMobile } from "@/stores/useUiStore";

interface ProfileHeaderProps {
  userName: string;
  nickName: string | null;
  avatarUrl: string;
  coverUrl: string;
  isOwnProfile: boolean;
  onSendMessage: () => void;
}

export function ProfileHeader({ userName, nickName, avatarUrl, coverUrl, isOwnProfile, onSendMessage }: ProfileHeaderProps) {
  const isDesktop = useIsDesktop();
  const isMobile = useIsMobile();

  return (
    <section
      style={{ height: !isDesktop ? "30%" : "80%" }}
      className="w-full relative flex flex-col justify-center items-center bg-[var(--color-bg-elevated)]"
    >
      <div className="absolute w-full h-[70%] top-0 blur-xl opacity-30 brightness-[.45]">
        <Image src={coverUrl} alt="" aspectRatio="16 / 9" containerClassName="h-full w-full" />
      </div>

      <div
        style={{ width: !isDesktop ? "100%" : "60%", height: !isDesktop ? "100%" : "80%" }}
        className="z-[10] relative flex flex-col justify-start items-start"
      >
        <Image
          src={coverUrl}
          alt=""
          aspectRatio="16 / 7"
          containerClassName={`w-full ${isDesktop ? "rounded-b" : ""}`}
          containerStyle={{ height: !isDesktop ? "80%" : "70%" }}
        />

        <div style={{ bottom: isMobile ? "2%" : "8%" }} className="w-full h-auto absolute left-0 flex justify-between items-center px-2">
          <div className="flex gap-2 justify-start items-center w-auto">
            <Image
              src={avatarUrl}
              alt={userName}
              aspectRatio="1 / 1"
              containerClassName={`rounded-full ${isMobile ? "w-[60px] h-[60px]" : "w-[150px] h-[150px]"}`}
            />

            <p
              style={{ fontSize: isMobile ? "0.9rem" : "2.2rem" }}
              className="px-2 bg-[var(--color-bg-overlay)] backdrop-blur rounded flex w-auto tracking-wide gap-2 font-medium"
            >
              {userName} {nickName && <span className="font-thin">({nickName})</span>}
            </p>
          </div>

          {!isOwnProfile && (
            <div className="flex gap-4 w-auto h-full justify-end items-end p-1">
              <button
                type="button"
                onClick={onSendMessage}
                className="bg-[var(--color-bg)] cursor-pointer hover:brightness-110 tracking-wide flex justify-center gap-1 items-center text-center w-auto px-2 rounded-md py-2"
              >
                <span className={isMobile ? "text-sm" : ""}>Send Message</span>
                <Icon path={mdiSendVariantOutline} size={isMobile ? 0.7 : 1} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
