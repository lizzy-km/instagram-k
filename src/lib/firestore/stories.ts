import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { toFirestoreOpError } from "./errors";
import type { StoryDoc } from "./types";

const STORIES_COLLECTION = "USER_STORYS";
const STORY_TTL_MS = 24 * 60 * 60 * 1000;

export async function fetchActiveStories(): Promise<StoryDoc[]> {
  try {
    const snap = await getDocs(collection(firestore, STORIES_COLLECTION));
    const now = Date.now();

    const stale: string[] = [];
    const active: StoryDoc[] = [];

    for (const d of snap.docs) {
      const data = d.data() as Omit<StoryDoc, "id">;
      const isStale = now - data.UPLOADED_AT > STORY_TTL_MS;

      if (isStale) {
        stale.push(d.id);
        continue;
      }

      active.push({ id: d.id, ...data });
    }

    if (stale.length > 0) {
      await Promise.allSettled(
        stale.map((id) => deleteDoc(doc(firestore, STORIES_COLLECTION, id)))
      );
    }

    return active;
  } catch (error) {
    throw toFirestoreOpError(error, "Failed to fetch stories");
  }
}

export async function deleteStory(storyId: string): Promise<void> {
  try {
    await deleteDoc(doc(firestore, STORIES_COLLECTION, storyId));
  } catch (error) {
    throw toFirestoreOpError(error, `Failed to delete story ${storyId}`);
  }
}
