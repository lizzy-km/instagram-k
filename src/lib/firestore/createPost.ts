import { doc, setDoc } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { toFirestoreOpError } from "./errors";
import type { PostDoc } from "./types";

export async function createPost(post: Omit<PostDoc, "id">): Promise<void> {
  try {
    await setDoc(doc(firestore, "USER_POSTS", post.PID), post);
  } catch (error) {
    throw toFirestoreOpError(error, "Failed to create post");
  }
}
