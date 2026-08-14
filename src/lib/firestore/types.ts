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
  senderId: string;
  createdAt: number;
}
