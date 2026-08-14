import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  deleteDoc,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { toFirestoreOpError } from "./errors";
import type { PostDoc } from "./types";

const POSTS_COLLECTION = "USER_POSTS";
export const POSTS_PAGE_SIZE = 10;

export interface PostsPage {
  posts: PostDoc[];
  cursor: QueryDocumentSnapshot<DocumentData> | null;
}

export async function fetchPostsPage(cursor: QueryDocumentSnapshot<DocumentData> | null): Promise<PostsPage> {
  try {
    const base = query(collection(firestore, POSTS_COLLECTION), orderBy("UPLOADED_AT", "desc"), limit(POSTS_PAGE_SIZE));
    const q = cursor ? query(base, startAfter(cursor)) : base;
    const snap = await getDocs(q);
    return {
      posts: snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PostDoc, "id">) })),
      cursor: snap.docs.at(-1) ?? null,
    };
  } catch (error) {
    throw toFirestoreOpError(error, "Failed to fetch posts page");
  }
}

export async function fetchPostById(postId: string): Promise<PostDoc | null> {
  try {
    const snap = await getDoc(doc(firestore, POSTS_COLLECTION, postId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as Omit<PostDoc, "id">) };
  } catch (error) {
    throw toFirestoreOpError(error, `Failed to fetch post ${postId}`);
  }
}

export async function fetchAllPosts(): Promise<PostDoc[]> {
  try {
    const q = query(collection(firestore, POSTS_COLLECTION), orderBy("UPLOADED_AT", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PostDoc, "id">) }));
  } catch (error) {
    throw toFirestoreOpError(error, "Failed to fetch posts");
  }
}

export async function fetchPostsByOwner(ownerId: string): Promise<PostDoc[]> {
  try {
    const q = query(
      collection(firestore, POSTS_COLLECTION),
      where("POST_OWNER_DETAIL.POID", "==", ownerId),
      orderBy("UPLOADED_AT", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PostDoc, "id">) }));
  } catch (error) {
    throw toFirestoreOpError(error, `Failed to fetch posts for owner ${ownerId}`);
  }
}

export async function deletePost(postId: string): Promise<void> {
  try {
    await deleteDoc(doc(firestore, POSTS_COLLECTION, postId));
  } catch (error) {
    throw toFirestoreOpError(error, `Failed to delete post ${postId}`);
  }
}
