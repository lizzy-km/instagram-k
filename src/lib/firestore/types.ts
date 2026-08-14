export interface CoverPhoto {
  CVID: string;
  src: string;
  isActive: boolean;
  uploaded_at: number;
}

export interface ProfilePhoto {
  PPID: string;
  src: string;
  isActive: boolean;
  isPublic: boolean;
  isPrivate: boolean;
  isFriendOnly: boolean;
}

export interface UserDoc {
  id: string;
  user_name: string;
  UID: string;
  nick_name: string;
  bio: string;
  email: string;
  isLogin: boolean;
  status: "online" | "offline" | null;
  cover_photo: CoverPhoto[];
  profile: ProfilePhoto[] | null;
  story: unknown[];
  post: unknown[];
  likes: unknown[];
  liked_post: LikedPostRef[];
  shares: unknown[];
  shared_posts: SharedPostRef[];
  saved_posts: SavedPostRef[];
  friends: unknown[];
}

export interface LikedPostRef {
  LPID: string;
  POID: string;
}

export interface SharedPostRef {
  SHPID: string;
  POID: string;
}

export interface SavedPostRef {
  SPID: string;
  POID: string;
}

export interface PostImage {
  downloadURL: string;
  isImg?: boolean;
}

export interface PostOwnerDetail {
  POID: string;
  PON: string;
}

export interface PostDetail {
  POST_IMAGE_PATH: PostImage[] | null;
  POST_CAPTION: string | null;
  LIKES: LikedPostRef[] | null;
  SHARES: SharedPostRef[] | null;
  HASHTAGS?: string[];
}

export interface CommentDoc {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  text: string;
  createdAt: number;
  editedAt?: number;
}

/** A follow edge: followerId follows followingId. Doc ID is `${followerId}_${followingId}`. */
export interface FollowDoc {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: number;
}

export interface PostDoc {
  id: string;
  PID: string;
  PUID: string;
  UPLOADED_AT: number;
  isImg: boolean;
  POST_DETAIL: PostDetail | null;
  POST_OWNER_DETAIL: PostOwnerDetail | null;
}

export interface StoryOwnerDetail {
  STOID: string;
  STON: string;
}

export interface StoryDetail {
  STORY_IMAGE_PATH: PostImage | null;
}

export interface StoryDoc {
  id: string;
  STID: string;
  UPLOADED_AT: number;
  STORY_OWNER_DETAIL: StoryOwnerDetail | null;
  STORY_DETAIL: StoryDetail | null;
}

export interface MessageDoc {
  id: string;
  mid: string;
  text: string;
  uid: string;
  target: string;
  photoURL: string | null;
  createdAt: number;
}

export interface NotificationDoc {
  id: string;
  uid: string;
  target: string;
  type: "like" | "share" | "comment" | "follow";
  text: string;
  createdAt: number;
  read: boolean;
}

export type ActivityType =
  | "post_created"
  | "post_liked"
  | "post_unliked"
  | "post_shared"
  | "post_unshared"
  | "post_saved"
  | "post_unsaved"
  | "post_commented"
  | "post_deleted"
  | "story_created"
  | "story_deleted"
  | "profile_updated"
  | "user_followed"
  | "user_unfollowed";

/** A single row in a user's own activity log - what *they* did, not what happened to them. */
export interface ActivityDoc {
  id: string;
  userId: string;
  type: ActivityType;
  targetId?: string;
  targetLabel?: string;
  createdAt: number;
}
