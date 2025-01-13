import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
const UpdateData = async (
  colName = "story",
  UID = "",
  PID = "",
  Data = {},
  Datal = {}
) => {
  const postRef = doc(firestore, "/USER_POSTS", `/${PID}`);
  const userRef = doc(firestore, "/users", `/${UID}/`);
  const udRef = doc(firestore, "/USER_POSTS", `/${PID}`);

  switch (colName) {
    case "status":
      await updateDoc(userRef, {
        status: Data,
      })
        .then(() => {
          console.log("Document successfully updated!");
        })
        .catch((error) => console.log(error));
      break;

    case "delete_user_post":
      await deleteDoc(postRef).catch((error) => console.log(error));
      break;

    case "liked_posts":
      await updateDoc(userRef, {
        liked_post: arrayUnion(Data),
      }).catch((error) => console.log(error));
      await updateDoc(udRef, {
        "POST_DETAIL.LIKES": arrayUnion(Datal),
      }).catch((error) => console.log(error));
      break;

    case "unliked_posts":
      await updateDoc(userRef, {
        liked_post: arrayRemove(Data),
      }).catch((error) => console.log(error));

      await updateDoc(udRef, {
        "POST_DETAIL.LIKES": arrayRemove(Datal),
      }).catch((error) => console.log(error));

      break;

    case "shared_posts":
      await updateDoc(userRef, {
        shared_posts: arrayUnion(Data),
      }).catch((error) => console.log(error));

      await updateDoc(udRef, {
        "POST_DETAIL.SHARES": arrayUnion(Datal),
      }).catch((error) => console.log(error));
      break;

    case "unshared_posts":
      await updateDoc(userRef, {
        shared_posts: arrayRemove(Data),
      }).catch((error) => console.log(error));

      await updateDoc(udRef, {
        "POST_DETAIL.SHARES": arrayRemove(Datal),
      }).catch((error) => console.log(error));
      break;

    case "saved_posts":
      await updateDoc(userRef, {
        saved_posts: arrayUnion(Data),
      }).catch((error) => console.log(error));
      break;

    case "unsaved_posts":
      await updateDoc(userRef, {
        saved_posts: arrayRemove(Data),
      }).catch((error) => console.log(error));
      break;

    case "story":
      await updateDoc(userRef, {
        story: [Data],
      }).catch((error) => console.log(error));
      break;

    case "profile":
      await updateDoc(userRef, {
        profile: [Data],
      }).catch((error) => console.log(error));
      break;

    default:
      break;
  }
};

export default UpdateData;
