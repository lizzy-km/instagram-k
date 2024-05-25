import {
  CollectionReference,
  Firestore,
  addDoc,
  collection,
  collectionGroup,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
const addData = async (colName = "users", uemail = "", username = "") => {
  function getFirstChars() {
    if (!username) return []; // Handle empty string case

    const words = username.split(" ");
    const firstChars = [];
    for (const word of words) {
      firstChars.push(word[0]);
    }
    return firstChars;
  }

  const firstCharacters = getFirstChars();

  let nick;

  for (let i = 0; i < firstCharacters.length; i++) {
    nick = firstCharacters.reduce((prev, curr) => prev + curr);
  }

  const name = username;
  const email = uemail;
  const bio = "It's me " + name;
  const UID = username.replace(/ /g, "_") + "Official";
  const shortName = nick;
  const nickName = "tyui";
  const date = new Date().getUTCMilliseconds();

  console.log(email);

  const userData = {
    user_name: name,
    UID: UID,
    isLogin: false,
    nick_name: nickName,
    bio: bio,
    profile_picture: [
      {
        PFID: shortName + "PF"+date,
        src: "",
        isActive: true,
      }
    ],
    cover_photo: [
      {
        CVID: shortName + "CV"+date,
        src: "",
        isActive: true,
      }
    ],
    story: [
      {
        STID: shortName + "ST"+date,
      }
    ],
    post: [
      {
        PID: shortName + "P"+date,
      }
    ],
    friends: [
      {
        FID: "dev.lizzy",
      },
    ],
    email: email,
    password: "Lizzy-020",
  };

  const storyData = {
    STID: shortName + "ST" + `${date}`,
    STUID: UID,
    img_src: "",

    isImg: false,

    vid_src:
      "https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2FStory_Video.mp4?alt=media&token=b28f5198-3080-4168-9283-f85d5e083c20",
  };

  const postData = {
    PID: shortName + "P" + `${date}`,
    PUID: UID,
    img_src: [""],

    isImg: false,

    vid_src: [
      "https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2FStory_Video.mp4?alt=media&token=b28f5198-3080-4168-9283-f85d5e083c20",
    ],
  };
  // Add a new document in collection "cities" with ID 'LA'
  const collectionRef = collection(firestore, 'story');
  const postRef = collection(firestore, 'user_posts');
  const userRef = collection(firestore, '/users' , `/${UID}/data`);
  const udRef = doc(firestore, 'users' ,`${UID}`);

  if (colName === "story"){
  const userS =  await addDoc(collectionRef, storyData).catch((error) => console.log(error));
  console.log(userS);

}
  if (colName === "user_posts"){
   const userP = await addDoc(postRef, postData).catch((error) => console.log(error));
   console.log(userP);

}
  if (colName === "users"){
    
     await setDoc(udRef, {id:UID}).catch((error) => console.log(error));
     await addDoc(userRef, userData).catch((error) => console.log(error));
     await addDoc(collectionRef, storyData).catch((error) => console.log(error));
     await addDoc(postRef, postData).catch((error) => console.log(error));

}

};

export default addData;
