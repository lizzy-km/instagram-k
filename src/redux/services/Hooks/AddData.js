
import { firestore } from "../../../firebase/firebase";
const addData = async (colName = "users") => {
  const name = "Park Chaeyoung";
  const email = "parkchaeyoung@gmail.com";
  const bio = "It's me " + name;
  const UID = "dev.lizzy";
  const shortName = "KM";
  const nickName = "tyui";

  const userData =   {
    user_name: name,
    UID: UID,
    isLogin: false,
    nick_name: nickName,
    bio: bio,
    profile_picture: [
      {
        PFID: shortName + "PF00",
        src: "",
        isActive: true,
      },
      {
        PFID: shortName + "PF01",
        src: "",
        isActive: false,
      },
      {
        PFID: shortName + "PF02",
        src: "",
        isActive: false,
      },
    ],
    cover_photo: [
      {
        CVID: shortName + "CV00",
        src: "",
        isActive: true,
      },
      {
        CVID: shortName + "CV01",
        src: "",
        isActive: false,
      },
      {
        CVID: shortName + "CV02",
        src: "",
        isActive: false,
      },
    ],
    story: [
      {
        STID: shortName + "ST00",
      },
      {
        STID: shortName + "ST01",
      },
      {
        STID: shortName + "ST02",
      },
    ],
    post: [
      {
        PID: shortName + "P00",
      },
      {
        PID: shortName + "P01",
      },
      {
        PID: shortName + "P02",
      },
    ],
    friends: [
      {
        FID: "dev.lizzy",
      },
    ],
    email: email,
    password: "Lizzy-020",
  }

  const storyData = {
    STID: shortName +"ST00",
    STUID: UID,
    img_src: "",

    isImg: false,

    vid_src:
      "https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2FStory_Video.mp4?alt=media&token=b28f5198-3080-4168-9283-f85d5e083c20",
  };


  
  // Add a new document in collection "cities" with ID 'LA'
  const collectionRef = doc(firestore,'users')

//   const res = await collectionRef.update({isLogin: true});

//   await addDoc(collectionRef, storyData);

  console.log(collectionRef);
};

export default addData;
