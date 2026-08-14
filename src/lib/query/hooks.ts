import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { fetchUserByUid, fetchUserByUsername, fetchAllUsers } from "@/lib/firestore/users";
import { fetchAllPosts, fetchPostsByOwner } from "@/lib/firestore/posts";
import { fetchActiveStories } from "@/lib/firestore/stories";

export function useUser(uid: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.users.byUid(uid ?? ""),
    queryFn: () => fetchUserByUid(uid as string),
    enabled: Boolean(uid),
  });
}

export function useUserByUsername(username: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.users.byUsername(username ?? ""),
    queryFn: () => fetchUserByUsername(username as string),
    enabled: Boolean(username),
  });
}

export function useAllUsers() {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: fetchAllUsers,
  });
}

export function useAllPosts() {
  return useQuery({
    queryKey: queryKeys.posts.all,
    queryFn: fetchAllPosts,
  });
}

export function usePostsByOwner(ownerId: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.posts.byOwner(ownerId ?? ""),
    queryFn: () => fetchPostsByOwner(ownerId as string),
    enabled: Boolean(ownerId),
  });
}

export function useActiveStories() {
  return useQuery({
    queryKey: queryKeys.stories.all,
    queryFn: fetchActiveStories,
    staleTime: 60_000,
  });
}

export function useStoriesByOwner(ownerId: string | null | undefined) {
  const { data, ...rest } = useActiveStories();
  return {
    ...rest,
    data: ownerId ? data?.filter((s) => s.STORY_OWNER_DETAIL?.STOID === ownerId) : [],
  };
}
