import { addDoc, collection, limit, orderBy, query, where } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { toFirestoreOpError } from "./errors";
import type { ActivityType } from "./types";

const ACTIVITY_COLLECTION = "ACTIVITY";

export function logActivity(userId: string, type: ActivityType, targetId?: string, targetLabel?: string): void {
  // Fire-and-forget: activity logging is a nice-to-have audit trail, never
  // something that should block or fail the action it's recording.
  addDoc(collection(firestore, ACTIVITY_COLLECTION), {
    userId,
    type,
    targetId: targetId ?? null,
    targetLabel: targetLabel ?? null,
    createdAt: Date.now(),
  }).catch((error) => {
    console.error(toFirestoreOpError(error, "Failed to log activity"));
  });
}

export function activityQuery(userId: string, max = 50) {
  return query(
    collection(firestore, ACTIVITY_COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(max)
  );
}
