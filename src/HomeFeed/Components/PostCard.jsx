import { getDownloadURL, listAll, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { storage } from "../../firebase/firebase";
const PostCard = ({ name, data }) => {
  const [userProfile, setUserProfile] = useState();
  const [storyImgs, setStoryImgs] = useState();
  const [postImgs, setPostImgs] = useState();
  const [postUrl, setPostUrl] = useState();
  const { userAvatar } = useSelector((state) => state.authSlice);

  const imgUrl = async (type) => {
    const urls = await getDownloadURL(
      ref(
        storage,
        type === "profile" ? storyImgs : type === "post" ? postImgs : null
      )
    );
    type === "profile"
      ? setUserProfile(urls)
      : type === "post"
      ? setPostUrl(urls)
      : null;
  };

  const hasPf = data?.profile_picture?.arrayValue?.values?.length > 0;

  const hasPostD = data?.post?.arrayValue?.values?.length > 0;

  const storageRef = ref(
    storage,
    `user_photo/${data?.UID?.stringValue}/${
      hasPf &&
      data?.profile_picture?.arrayValue?.values[0]?.mapValue?.fields?.PFID
        ?.stringValue
    }`
  );

  const postRef = ref(
    storage,
    `user_post/${data?.UID?.stringValue}/${
      hasPostD &&
      data?.post?.arrayValue?.values[0]?.mapValue?.fields?.PID?.stringValue
    }`
  );

  const list = async (type) => {
    const not = await listAll(
      type == "profile" ? storageRef : type === "post" ? postRef : null
    );

    for (let ii = 0; ii < not?.items.length; ii++) {
      type === "profile"
        ? setStoryImgs(not.items[ii]?.fullPath)
        : type === "post"
        ? setPostImgs(not.items[ii]?.fullPath)
        : null;
    }
  };

  useEffect(() => {
    list("post");
    list("profile");
  }, []);

  useEffect(() => {
    imgUrl("post");
    imgUrl("profile");
  }, [storyImgs]);

  if (hasPostD)
    return (
      <section className=" flex flex-col p-2 gap-2 rounded-md bg-[#212121] w-full ">
        <div className=" w-full h-[50px] p-1 flex justify-between items-center ">
          <div className=" w-auto h-fulll flex justify-start items-start ">
            <div className=" rounded-full  bg-[#333333] ">
              <img
                className=" w-[40px] p-1 h-[40px] rounded-full object-cover cursor-pointer "
                src={userProfile?.length > 0 ? userProfile : userAvatar}
                alt=""
                srcset=""
              />
            </div>
            <div className=" cursor-pointer px-2 py-1 w-auto justify-start items-start text-sm h-full ">
              <p>{name}</p>
            </div>
          </div>
        </div>

        <p className=" p-1 ">
          {
            data?.post.arrayValue.values[0]?.mapValue.fields.caption
              ?.stringValue
          }
        </p>

        <img className=" w-full " src={postUrl} alt="" srcset="" />
      </section>
    );
};

export default PostCard;
