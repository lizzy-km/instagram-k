import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { firestore, storage } from "../../firebase/firebase";
import PostCard from "./PostCard";
import { addDoc, collection, doc, getDocs, setDoc } from "firebase/firestore";
import checkFileType from "../../redux/services/Hooks/CheckFileType";

const Post = () => {
  const { admin, adminProfile, UserData } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const { isTablet, isMobile, isDeskTop } = useSelector(
    (state) => state.animateSlice
  );

 

  const [USER_POSTS, setUSER_POSTS] = useState([]);

  const User_post = async () =>
    await getDocs(collection(firestore, "/USER_POSTS"))
      .then((data) => setUSER_POSTS(data))
      .catch((error) => console.log(error))
      .finally(() => console.log(USER_POSTS));

  useEffect(() => {
    User_post();
  }, []);

  if (USER_POSTS?.docs?.length > 0)
    return (
      <div
        style={{
          width: isMobile ? "100%" : "80%",
        }}
        className="flex flex-col gap-8 w-[70%] self-center  p-2 my-2 h-auto  rounded-md"
      >
        {USER_POSTS?.docs?.map((d) => {
          const data = d._document.data.value.mapValue.fields;
          const PID = data?.PID.stringValue;
          const PON = data?.POST_OWNER_DETAIL.mapValue.fields.PON.stringValue;
          
          return <PostCard data={data} name={PON} key={PID} />;
        })}
      </div>
    );
};

export default Post;
