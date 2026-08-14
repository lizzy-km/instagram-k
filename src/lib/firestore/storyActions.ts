import { doc, setDoc } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { toFirestoreOpError } from "./errors";
import type { StoryDoc } from "./types";

export async function createStory(story: Omit<StoryDoc, "id">): Promise<void> {
  try {
    await setDoc(doc(firestore, "USER_STORYS", story.STID), story);
  } catch (error) {
    throw toFirestoreOpError(error, "Failed to create story");
  }
}
