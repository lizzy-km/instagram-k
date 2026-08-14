import { addDoc, collection } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { toFirestoreOpError } from "./errors";

export function threadId(userIdA: string, userIdB: string): string {
  return [userIdA, userIdB].join("_");
}

export async function sendMessage(params: {
  text: string;
  senderId: string;
  targetId: string;
  photoURL: string | null;
}): Promise<void> {
  try {
    await addDoc(collection(firestore, "MESSAGES"), {
      text: params.text,
      createdAt: Date.now(),
      uid: params.senderId,
      target: params.targetId,
      mid: threadId(params.senderId, params.targetId),
      photoURL: params.photoURL,
    });
  } catch (error) {
    throw toFirestoreOpError(error, "Failed to send message");
  }
}
