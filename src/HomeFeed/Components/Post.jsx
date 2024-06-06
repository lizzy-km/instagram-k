import { getDownloadURL, listAll, ref } from "firebase/storage";
import React from "react";
import { useSelector } from "react-redux";
import { storage } from "../../firebase/firebase";
import PostCard from "./PostCard";

const Post = () => {
  const { admin, adminProfile, UserData } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const { isTablet, isMobile, isDeskTop } = useSelector(
    (state) => state.animateSlice
  );


  if (UserData.length > 0)
    return (
      <div style={{
        width: isMobile ? '100%' : '80%'
      }} className="flex flex-col gap-8 w-[70%] self-center  p-2 my-2 h-auto  rounded-md">
        {UserData?.map((d) => {
          const name =
            d?._document.data.value.mapValue.fields?.user_name.stringValue;
          const data = d?._document.data.value.mapValue.fields;
          return <PostCard data={data} name={name} key={d.id} />;
        })}
      </div>
    );
};

export default Post;
