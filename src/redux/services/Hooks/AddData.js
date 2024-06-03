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
const addData = async (colName = "users", uemail = "", username = "",name) => {
  function getFirstChars() {
    if (!name) return []; // Handle empty string case

    const words = name.split(" ");
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

  const email = uemail;
  const bio = "It's me " + name;
  // const UID = username.replace(/ /g, "_") + "Official";
  const shortName = nick;
  const nickName = "qwer";
  const date = new Date().getUTCMilliseconds();


  const userData = {
    user_name: name,
    UID: username,
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
     
    ],
    post: [
    
    ],
    likes:[],
    liked_post:[],
    shares:[],
    shared_posts:[],
    saved_posts:[],
    friends: [
     
    ],
    email: email,
    password: "Lizzy-020",
  };

  const storyData = {
    STID: shortName + "ST" + `${date}`,
    STUID: username,
    img_src: "",

    isImg: false,

    vid_src:
      "https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2FStory_Video.mp4?alt=media&token=b28f5198-3080-4168-9283-f85d5e083c20",
  };

  const postData = {
    PID: shortName + "P" + `${date}`,
    PUID: username,

    isImg: false,

    
  };
  // Add a new document in collection "cities" with ID 'LA'
  const collectionRef = collection(firestore, 'story');
  const postRef = collection(firestore, 'user_posts');
  const userRef = collection(firestore, '/users' , `/${username}/data`);
  const udRef = doc(firestore, 'users' ,`/${username}/`);

  if (colName === "story"){
   await addDoc(collectionRef, data).catch((error) => console.log(error));

}
  if (colName === "user_posts"){
    await addDoc(postRef, postData).catch((error) => console.log(error));

}
  if (colName === "users"){
    
     await setDoc(udRef, userData).catch((error) => console.log(error));

}

};

export default addData;
