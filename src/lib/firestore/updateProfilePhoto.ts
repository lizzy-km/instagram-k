import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { toFirestoreOpError } from "./errors";
import type { ProfilePhoto } from "./types";

export async function updateProfilePhoto(userId: string, photo: ProfilePhoto): Promise<void> {
  try {
    await updateDoc(doc(firestore, "users", userId), { profile: [photo] });
  } catch (error) {
    throw toFirestoreOpError(error, `Failed to update profile photo for ${userId}`);
  }
}
