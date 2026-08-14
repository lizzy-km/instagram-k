import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { toFirestoreOpError } from "./errors";
import type { UserDoc } from "./types";

const USERS_COLLECTION = "users";

export async function fetchUserByUid(uid: string): Promise<UserDoc | null> {
  try {
    const snap = await getDoc(doc(firestore, USERS_COLLECTION, uid));
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as Omit<UserDoc, "id">) };
  } catch (error) {
    throw toFirestoreOpError(error, `Failed to fetch user ${uid}`);
  }
}

export async function fetchUserByUsername(username: string): Promise<UserDoc | null> {
  try {
    const q = query(collection(firestore, USERS_COLLECTION), where("UID", "==", username));
    const snap = await getDocs(q);
    const first = snap.docs[0];
    if (!first) return null;
    return { id: first.id, ...(first.data() as Omit<UserDoc, "id">) };
  } catch (error) {
    throw toFirestoreOpError(error, `Failed to fetch user by username ${username}`);
  }
}

export async function fetchAllUsers(): Promise<UserDoc[]> {
  try {
    const snap = await getDocs(collection(firestore, USERS_COLLECTION));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<UserDoc, "id">) }));
  } catch (error) {
    throw toFirestoreOpError(error, "Failed to fetch users");
  }
}
