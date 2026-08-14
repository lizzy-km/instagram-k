import { addDoc, collection, deleteDoc, doc, orderBy, query, where } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { toFirestoreOpError } from "./errors";

const COMMENTS_COLLECTION = "COMMENTS";

export function commentsQuery(postId: string) {
  return query(collection(firestore, COMMENTS_COLLECTION), where("postId", "==", postId), orderBy("createdAt"));
}

export async function addComment(params: {
  postId: string;
  authorId: string;
  authorName: string;
  text: string;
}): Promise<void> {
  try {
    await addDoc(collection(firestore, COMMENTS_COLLECTION), {
      postId: params.postId,
      authorId: params.authorId,
      authorName: params.authorName,
      text: params.text,
      createdAt: Date.now(),
    });
  } catch (error) {
    throw toFirestoreOpError(error, "Failed to add comment");
  }
}

export async function deleteComment(commentId: string): Promise<void> {
  try {
    await deleteDoc(doc(firestore, COMMENTS_COLLECTION, commentId));
  } catch (error) {
    throw toFirestoreOpError(error, `Failed to delete comment ${commentId}`);
  }
}
