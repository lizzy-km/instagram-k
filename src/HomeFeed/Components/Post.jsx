import { getDownloadURL, listAll, ref } from "firebase/storage";
import React from "react";
import { useSelector } from "react-redux";
import { storage } from "../../firebase/firebase";
import PostCard from "./PostCard";

const Post = () => {
  const { admin, adminProfile, UserData } = useSelector(
    (state) => state.authSlice
  );

  if (UserData.length > 0)
    return (
      <div className="flex flex-col gap-8 w-full p-2 my-2 h-auto  rounded-md">
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
