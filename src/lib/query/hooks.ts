import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { fetchUserByUid, fetchUserByUsername, fetchAllUsers } from "@/lib/firestore/users";
import { fetchAllPosts, fetchPostById, fetchPostsByOwner } from "@/lib/firestore/posts";
import { fetchActiveStories } from "@/lib/firestore/stories";
import { fetchFollowers, fetchFollowing } from "@/lib/firestore/follows";

const MISSING_PROFILE_MAX_POLLS = 4;

export function useUser(uid: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.users.byUid(uid ?? ""),
    queryFn: () => fetchUserByUid(uid as string),
    enabled: Boolean(uid),
    // A user doc can briefly not exist yet right after sign-up (auth state
    // resolves before the profile-creation write lands). Poll a few times
    // instead of trusting a single "not found" result for the full staleTime,
    // then give up so a genuinely missing profile doesn't poll forever.
    refetchInterval: (query) =>
      query.state.data === null && query.state.dataUpdateCount <= MISSING_PROFILE_MAX_POLLS ? 1500 : false,
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

export function usePost(postId: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.posts.byId(postId ?? ""),
    queryFn: () => fetchPostById(postId as string),
    enabled: Boolean(postId),
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

export function useFollowing(userId: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.follows.following(userId ?? ""),
    queryFn: () => fetchFollowing(userId as string),
    enabled: Boolean(userId),
  });
}

export function useFollowers(userId: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.follows.followers(userId ?? ""),
    queryFn: () => fetchFollowers(userId as string),
    enabled: Boolean(userId),
  });
}

export function useIsFollowing(followerId: string | null | undefined, followingId: string | null | undefined) {
  const { data: following, ...rest } = useFollowing(followerId);
  return {
    ...rest,
    data: Boolean(following?.some((f) => f.followingId === followingId)),
  };
}
