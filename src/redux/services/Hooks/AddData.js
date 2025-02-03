import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
const addData = async (colName = "users", uemail = "", username = "", name) => {
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
    cover_photo: [
      {
        CVID: shortName + "CV" + date,
        src: "",
        isActive: true,
        uploaded_at: Date.now(),
      },
    ],
    story: [],
    post: [],
    likes: [],
    liked_post: [],
    shares: [],
    shared_posts: [],
    saved_posts: [],
    friends: [],
    email: email,
  };

  const postData = {
    PID: shortName + "P" + `${date}`,
    PUID: username,
    uploaded_at: Date.now(),
    isImg: false,
  };
  // Add a new document in collection "cities" with ID 'LA'
  const collectionRef = collection(firestore, "story");
  const postRef = collection(firestore, "user_posts");
  const udRef = doc(firestore, "users", `/${username}/`);

  if (colName === "story") {
    await addDoc(collectionRef, data).catch((error) => console.log(error));
  }
  if (colName === "user_posts") {
    await addDoc(postRef, postData).catch((error) => console.log(error));
  }
  if (colName === "users") {
    await setDoc(udRef, userData).catch((error) => console.log(error));
  }
};

export default addData;
