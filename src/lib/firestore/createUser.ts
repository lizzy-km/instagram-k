import { doc, setDoc } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { toFirestoreOpError } from "./errors";
import type { ProfilePhoto, UserDoc } from "./types";

export async function createUserDoc(params: {
  uid: string;
  email: string;
  name: string;
  profile: ProfilePhoto[];
}): Promise<void> {
  const userData: Omit<UserDoc, "id"> = {
    user_name: params.name,
    UID: params.uid,
    isLogin: false,
    nick_name: "",
    bio: `It's me ${params.name}`,
    email: params.email,
    status: null,
    cover_photo: [],
    profile: params.profile,
    story: [],
    post: [],
    likes: [],
    liked_post: [],
    shares: [],
    shared_posts: [],
    saved_posts: [],
    friends: [],
  };

  try {
    await setDoc(doc(firestore, "users", params.uid), userData);
  } catch (error) {
    throw toFirestoreOpError(error, `Failed to create user ${params.uid}`);
  }
}
