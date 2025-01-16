import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import GetTime from "./GetTime";

const FetchStoryAndDeleteOutDate = () => {
 
  async function USER_STORY() {
    await getDocs(collection(firestore, "/USER_STORYS"))
      .then((data) => {
        data?.docs?.map(async (data) => {
          const storyRef = doc(firestore, "/USER_STORYS", `/${data?.id}`);

          const miliSec = data?._document?.createTime.timestamp.seconds * 1000;
          const { timeINMin } = GetTime(miliSec);

          if (timeINMin > 1440) {
            await deleteDoc(storyRef);
          }
        });
      })
      .catch((error) => console.log(error));
  }
  return USER_STORY();
};

export default FetchStoryAndDeleteOutDate;
