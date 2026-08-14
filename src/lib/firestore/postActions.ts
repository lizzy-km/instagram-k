import { arrayRemove, arrayUnion, doc, updateDoc, type FieldValue } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { toFirestoreOpError } from "./errors";
import type { LikedPostRef, SavedPostRef, SharedPostRef } from "./types";

async function updateUserAndPost(
  userId: string,
  postId: string,
  userField: string,
  userValue: FieldValue,
  postField?: string,
  postValue?: FieldValue
) {
  try {
    await updateDoc(doc(firestore, "users", userId), { [userField]: userValue });
    if (postField !== undefined) {
      await updateDoc(doc(firestore, "USER_POSTS", postId), { [postField]: postValue });
    }
  } catch (error) {
    throw toFirestoreOpError(error, `Failed to update ${userField} for user ${userId}`);
  }
}

export function likePost(userId: string, postId: string, ref: LikedPostRef) {
  return updateUserAndPost(userId, postId, "liked_post", arrayUnion(ref), "POST_DETAIL.LIKES", arrayUnion(ref));
}

export function unlikePost(userId: string, postId: string, ref: LikedPostRef) {
  return updateUserAndPost(userId, postId, "liked_post", arrayRemove(ref), "POST_DETAIL.LIKES", arrayRemove(ref));
}

export function sharePost(userId: string, postId: string, ref: SharedPostRef) {
  return updateUserAndPost(userId, postId, "shared_posts", arrayUnion(ref), "POST_DETAIL.SHARES", arrayUnion(ref));
}

export function unsharePost(userId: string, postId: string, ref: SharedPostRef) {
  return updateUserAndPost(userId, postId, "shared_posts", arrayRemove(ref), "POST_DETAIL.SHARES", arrayRemove(ref));
}

export function savePostRemote(userId: string, ref: SavedPostRef) {
  return updateUserAndPost(userId, "", "saved_posts", arrayUnion(ref));
}

export function unsavePostRemote(userId: string, ref: SavedPostRef) {
  return updateUserAndPost(userId, "", "saved_posts", arrayRemove(ref));
}

export async function setUserOnlineStatus(userId: string, status: "online" | "offline") {
  try {
    await updateDoc(doc(firestore, "users", userId), { status });
  } catch (error) {
    throw toFirestoreOpError(error, `Failed to update status for user ${userId}`);
  }
}
