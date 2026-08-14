import { addDoc, collection } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { toFirestoreOpError } from "./errors";
import type { NotificationDoc } from "./types";

export async function createNotification(notification: Omit<NotificationDoc, "id" | "read">): Promise<void> {
  try {
    await addDoc(collection(firestore, "NOTIFICATION"), { ...notification, read: false });
  } catch (error) {
    throw toFirestoreOpError(error, "Failed to create notification");
  }
}
