import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebase";
import { useUser } from "@/lib/query/hooks";
import { useSessionStore } from "@/stores/useSessionStore";
import { setUserOnlineStatus } from "@/lib/firestore/postActions";

export function useCurrentUser() {
  const [firebaseUser, authLoading] = useAuthState(auth);
  const uid = firebaseUser?.uid ?? null;
  const { data: admin, isLoading: profileLoading } = useUser(uid);
  const setAdmin = useSessionStore((s) => s.setAdmin);

  useEffect(() => {
    setAdmin(admin ?? null);
  }, [admin, setAdmin]);

  useEffect(() => {
    if (!uid) return;
    const activeUid = uid;

    setUserOnlineStatus(activeUid, "online").catch(() => {
      // best-effort presence signal, ignore failures
    });

    function handleOffline() {
      setUserOnlineStatus(activeUid, "offline").catch(() => {});
    }

    window.addEventListener("beforeunload", handleOffline);
    return () => window.removeEventListener("beforeunload", handleOffline);
  }, [uid]);

  return {
    uid,
    isAuthenticated: Boolean(firebaseUser),
    admin: admin ?? null,
    isLoading: authLoading || profileLoading,
  };
}
