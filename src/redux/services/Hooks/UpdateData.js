import {
  CollectionReference,
  Firestore,
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  collectionGroup,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import { set } from "firebase/database";
const UpdateData = async (
  colName = "story",
  UID = "",
  USID = "",
  Data = {},
  Datal = {}
) => {
  //   function getFirstChars() {
  //     if (!name) return []; // Handle empty string case

  //     const words = name?.split(" ");
  //     const firstChars = [];
  //     for (const word of words) {
  //       firstChars.push(word[0]);
  //     }
  //     return firstChars;
  //   }

  //   const firstCharacters = getFirstChars();

  //   let nick;

  //   for (let i = 0; i < firstCharacters.length; i++) {
  //     nick = firstCharacters.reduce((prev, curr) => prev + curr);
  //   }

  const collectionRef = collection(firestore, "story");
  const postRef = collection(firestore, "user_posts");
  const userRef = doc(firestore, "/users", `/${UID}/`); 
  const udRef = doc(firestore, "/users", `/${USID}`);

  if (colName === "user_posts")
    await updateDoc(userRef, {
      post: arrayUnion(Data),
    }).catch((error) => console.log(error));

  if (colName === "liked_posts") {
    await updateDoc(userRef, {
      liked_post: arrayUnion(Data),
    }).catch((error) => console.log(error));

    await updateDoc(udRef, {
      likes: arrayUnion(Datal),
    }).catch((error) => console.log(error));
  }

  if (colName === "unliked_posts") {
    await updateDoc(userRef, {
      liked_post: arrayRemove(Data),
    }).catch((error) => console.log(error));

    await updateDoc(udRef, {
      likes: arrayRemove(Datal),
    }).catch((error) => console.log(error));
  }
  if (colName === "shared_posts") {
    await updateDoc(userRef, {
      shared_posts: arrayUnion(Data),
    }).catch((error) => console.log(error));

    await updateDoc(udRef, {
      shares: arrayUnion(Datal),
    }).catch((error) => console.log(error));
  }
  if (colName === "unshared_posts") {
    await updateDoc(userRef, {
      shared_posts: arrayRemove(Data),
    }).catch((error) => console.log(error));

    await updateDoc(udRef, {
      shares: arrayRemove(Datal),
    }).catch((error) => console.log(error));
  }
  if (colName === "saved_posts") {
    await updateDoc(userRef, {
      saved_posts: arrayUnion(Data),
    }).catch((error) => console.log(error));
  }
  if (colName === "unsaved_posts") {
    await updateDoc(userRef, {
      saved_posts: arrayRemove(Data),
    }).catch((error) => console.log(error));
  }

  if (colName === "story") {
    await updateDoc(userRef, {
      story: [Data],
    })
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  }

  if (colName === "profile") {
    await updateDoc(userRef, {
      profile: [Data],
    })
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  }
};

export default UpdateData;
