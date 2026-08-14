import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { toFirestoreOpError } from "./errors";
import type { FollowDoc } from "./types";

const FOLLOWS_COLLECTION = "FOLLOWS";

function followDocId(followerId: string, followingId: string): string {
  return `${followerId}_${followingId}`;
}

export async function followUser(followerId: string, followingId: string): Promise<void> {
  try {
    const id = followDocId(followerId, followingId);
    await setDoc(doc(firestore, FOLLOWS_COLLECTION, id), {
      followerId,
      followingId,
      createdAt: Date.now(),
    });
  } catch (error) {
    throw toFirestoreOpError(error, `Failed to follow ${followingId}`);
  }
}

export async function unfollowUser(followerId: string, followingId: string): Promise<void> {
  try {
    const id = followDocId(followerId, followingId);
    await deleteDoc(doc(firestore, FOLLOWS_COLLECTION, id));
  } catch (error) {
    throw toFirestoreOpError(error, `Failed to unfollow ${followingId}`);
  }
}

export async function fetchFollowing(userId: string): Promise<FollowDoc[]> {
  try {
    const q = query(collection(firestore, FOLLOWS_COLLECTION), where("followerId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FollowDoc, "id">) }));
  } catch (error) {
    throw toFirestoreOpError(error, `Failed to fetch who ${userId} follows`);
  }
}

export async function fetchFollowers(userId: string): Promise<FollowDoc[]> {
  try {
    const q = query(collection(firestore, FOLLOWS_COLLECTION), where("followingId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FollowDoc, "id">) }));
  } catch (error) {
    throw toFirestoreOpError(error, `Failed to fetch ${userId}'s followers`);
  }
}
