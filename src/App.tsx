import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import "./App.css";

import { useCurrentUser } from "@/features/auth/useCurrentUser";
import { LoginPage } from "@/features/auth/LoginPage";
import { NavBar } from "@/features/nav/NavBar";
import { BottomTabBar } from "@/features/nav/components/BottomTabBar";
import { StoryRail } from "@/features/stories/StoryRail";
import { ViewStoryModal } from "@/features/stories/ViewStoryModal";
import { CreateStoryModal } from "@/features/stories/CreateStoryModal";
import { CreatePostModal } from "@/features/feed/CreatePostModal";
import { AddProfilePhotoModal } from "@/features/profile/AddProfilePhotoModal";
import { NotFoundPage } from "@/features/notFound/NotFoundPage";
import { ErrorBoundary, EmptyState, Spinner } from "@/Components/ui";
import { useUiStore, useIsMobile, type Breakpoint } from "@/stores/useUiStore";
import { DEFAULT_AVATAR_URL } from "@/lib/defaultAssets";

const FeedPage = lazy(() => import("@/features/feed/FeedPage").then((m) => ({ default: m.FeedPage })));
const ProfilePage = lazy(() => import("@/features/profile/ProfilePage").then((m) => ({ default: m.ProfilePage })));
const WatchPage = lazy(() => import("@/features/watch/WatchPage").then((m) => ({ default: m.WatchPage })));
const GroupPage = lazy(() => import("@/features/group/GroupPage").then((m) => ({ default: m.GroupPage })));
const GamePage = lazy(() => import("@/features/game/GamePage").then((m) => ({ default: m.GamePage })));
const MenuPage = lazy(() => import("@/features/menu/MenuPage").then((m) => ({ default: m.MenuPage })));
const SavedPage = lazy(() => import("@/features/saved/SavedPage").then((m) => ({ default: m.SavedPage })));
const NotificationsPage = lazy(() =>
  import("@/features/notifications/NotificationsPage").then((m) => ({ default: m.NotificationsPage }))
);
const MessengerPanel = lazy(() =>
  import("@/features/messenger/MessengerPanel").then((m) => ({ default: m.MessengerPanel }))
);
const PostDetailPage = lazy(() =>
  import("@/features/post/PostDetailPage").then((m) => ({ default: m.PostDetailPage }))
);
const HashtagPage = lazy(() => import("@/features/hashtags/HashtagPage").then((m) => ({ default: m.HashtagPage })));
const ActivityPage = lazy(() =>
  import("@/features/activity/ActivityPage").then((m) => ({ default: m.ActivityPage }))
);

function getBreakpoint(width: number): Breakpoint {
  if (width < 770) return "mobile";
  if (width < 1150) return "tablet";
  return "desktop";
}

function PageFallback() {
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <Spinner size={32} />
    </div>
  );
}

function App() {
  const { uid, isAuthenticated, admin, isLoading, isProfileMissing } = useCurrentUser();
  const setBreakpoint = useUiStore((s) => s.setBreakpoint);
  const isMobile = useIsMobile();

  useEffect(() => {
    function onResize() {
      setBreakpoint(getBreakpoint(window.innerWidth));
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setBreakpoint]);

  if (isLoading) return <PageFallback />;

  const defaultAvatar = DEFAULT_AVATAR_URL;
  const avatarUrl = admin?.profile?.[0]?.src || defaultAvatar;

  // isAuthenticated reflects Firebase Auth alone. `admin` (the Firestore
  // user doc) can still be null right after login while its query is
  // in flight - that must not be treated as "not logged in" and bounce
  // the user back to the Login page.
  const isLoggedIn = isAuthenticated && Boolean(uid);

  return (
    <section className="bg-[var(--color-bg)] relative min-h-screen w-full flex flex-col">
      <div className="fixed right-0 max-h-[70px] h-[70px] top-0 z-[9999]">
        <ToastContainer autoClose={1000} />
      </div>

      <BrowserRouter>
        {isLoggedIn && uid && admin && (
          <>
            <NavBar userId={uid} userName={admin.user_name} avatarUrl={avatarUrl} />
            <CreatePostModal currentUserId={uid} currentUserName={admin.user_name} avatarUrl={avatarUrl} />
            <CreateStoryModal currentUserId={uid} currentUserName={admin.user_name} />
            <ViewStoryModal currentUserId={uid} defaultAvatar={defaultAvatar} />
            <AddProfilePhotoModal currentUserId={uid} />
          </>
        )}

        <div className={isLoggedIn && isMobile ? "pb-16" : ""}>
          <ErrorBoundary>
            <Suspense fallback={<PageFallback />}>
              {!isLoggedIn ? (
                <Routes>
                  <Route path="/*" element={<LoginPage />} />
                </Routes>
              ) : isProfileMissing ? (
                <div className="flex w-full h-screen items-center justify-center">
                  <EmptyState
                    title="We couldn't find your profile"
                    description="Your account signed in, but no profile data exists for it yet. Try refreshing, or contact support if this keeps happening."
                  />
                </div>
              ) : !uid || !admin ? (
                <PageFallback />
              ) : (
                <Routes>
                  <Route
                    path="/"
                    element={
                      <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-6 pt-[76px] px-3">
                        <StoryRail currentUserId={uid} defaultAvatar={defaultAvatar} />
                        <FeedPage currentUserId={uid} />
                      </div>
                    }
                  />
                  <Route path="/game" element={<GamePage />} />
                  <Route path="/gallery" element={<WatchPage defaultAvatar={defaultAvatar} />} />
                  <Route path="/group" element={<GroupPage />} />
                  <Route path="/saved" element={<SavedPage currentUserId={uid} defaultAvatar={defaultAvatar} />} />
                  <Route
                    path="/message"
                    element={
                      <div className="mx-auto flex h-[calc(100vh-68px)] w-full max-w-2xl flex-col pt-[68px]">
                        <MessengerPanel currentUserId={uid} currentUserAvatar={avatarUrl} defaultAvatar={defaultAvatar} />
                      </div>
                    }
                  />
                  <Route
                    path="/message/:id"
                    element={
                      <div className="mx-auto flex h-[calc(100vh-68px)] w-full max-w-2xl flex-col pt-[68px]">
                        <MessengerPanel currentUserId={uid} currentUserAvatar={avatarUrl} defaultAvatar={defaultAvatar} />
                      </div>
                    }
                  />
                  <Route path="/notification" element={<NotificationsPage currentUserId={uid} />} />
                  <Route path="/menu" element={<MenuPage userId={uid} userName={admin.user_name} avatarUrl={avatarUrl} />} />
                  <Route path="/activity" element={<ActivityPage userId={uid} />} />
                  <Route path="/tags/:tag" element={<HashtagPage currentUserId={uid} defaultAvatar={defaultAvatar} />} />

                  <Route path="/profile/:username" element={<Navigate to="/:username" replace />} />
                  <Route path="/:uid/post_detail/:pid" element={<PostDetailPage currentUserId={uid} />} />
                  <Route path="/:user" element={<ProfilePage currentUserId={uid} defaultAvatar={defaultAvatar} />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              )}
            </Suspense>
          </ErrorBoundary>
        </div>

        {isLoggedIn && isMobile && uid && admin && <BottomTabBar avatarUrl={avatarUrl} userId={uid} />}
      </BrowserRouter>
    </section>
  );
}

export default App;
