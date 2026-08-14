export const queryKeys = {
  users: {
    all: ["users"] as const,
    byUid: (uid: string) => ["users", uid] as const,
    byUsername: (username: string) => ["users", "by-username", username] as const,
  },
  posts: {
    all: ["posts"] as const,
    byId: (postId: string) => ["posts", "by-id", postId] as const,
    byOwner: (ownerId: string) => ["posts", "by-owner", ownerId] as const,
  },
  stories: {
    all: ["stories"] as const,
    byOwner: (ownerId: string) => ["stories", "by-owner", ownerId] as const,
  },
  messages: {
    thread: (threadId: string) => ["messages", "thread", threadId] as const,
  },
  comments: {
    byPost: (postId: string) => ["comments", "by-post", postId] as const,
  },
  follows: {
    following: (userId: string) => ["follows", "following", userId] as const,
    followers: (userId: string) => ["follows", "followers", userId] as const,
  },
  activity: {
    byUser: (userId: string) => ["activity", "by-user", userId] as const,
  },
} as const;
