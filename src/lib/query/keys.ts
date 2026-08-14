export const queryKeys = {
  users: {
    all: ["users"] as const,
    byUid: (uid: string) => ["users", uid] as const,
    byUsername: (username: string) => ["users", "by-username", username] as const,
  },
  posts: {
    all: ["posts"] as const,
    byOwner: (ownerId: string) => ["posts", "by-owner", ownerId] as const,
  },
  stories: {
    all: ["stories"] as const,
    byOwner: (ownerId: string) => ["stories", "by-owner", ownerId] as const,
  },
  messages: {
    thread: (threadId: string) => ["messages", "thread", threadId] as const,
  },
} as const;
