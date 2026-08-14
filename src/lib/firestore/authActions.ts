import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { setUserOnlineStatus } from "./postActions";

export async function logoutUser(userId: string): Promise<void> {
  await setUserOnlineStatus(userId, "offline");
  await signOut(auth);
}
