import { collection, getDocs } from "firebase/firestore";
import  { useState } from "react";
import { firestore } from "../../firebase/firebase";

const GetUserPost = () => {
  const [USER_POSTS, setUSER_POSTS] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  return async function () {
    await getDocs(collection(firestore, "/USER_POSTS"))
      .then((data) => setUSER_POSTS(data))
      .catch((error) => console.log(error))
      .finally(() =>{ setIsLoading(false)
        return {
            USER_POSTS,
            isLoading,
          };
      });

    
  };
};

export default GetUserPost;
