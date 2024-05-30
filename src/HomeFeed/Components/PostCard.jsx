import { getDownloadURL, listAll, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { storage } from "../../firebase/firebase";
import { NavLink, useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import {
    mdiBookmark,
  mdiBookmarkOutline,
  mdiChatOutline,
  mdiHeart,
  mdiHeartOutline,
  mdiShare,
  mdiShareOutline,
} from "@mdi/js";
import UpdateData from "../../redux/services/Hooks/UpdateData";
const PostCard = ({ name, data }) => {
  const [userProfile, setUserProfile] = useState();
  const [storyImgs, setStoryImgs] = useState();
  const [postImgs, setPostImgs] = useState();
  const [postUrl, setPostUrl] = useState();
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const [saved, setSaved] = useState(false);

  const navigate = useNavigate();

  const { userAvatar, UserData, admin, hasNewStory } = useSelector(
    (state) => state.authSlice
  );

  const hasPf = data?.profile_picture?.arrayValue?.values?.length > 0;

  const hasPostD = data?.post?.arrayValue?.values?.length > 0;

  const PID = hasPostD
    ? data?.post?.arrayValue?.values[0]?.mapValue?.fields?.PID?.stringValue
    : "0";

  const user_name = admin?.user_name.stringValue;

  const postAction = (type, value) => {
    const upData =
      type === "liked_posts" || type === "unliked_posts"
        ? {
            LPID: PID,
          }
        : type === "shared_posts" || type === "unshared_posts"
        ? {
            SHPID: PID,
          }
        : type === "saved_posts" || type === "unsaved_posts"
        ? {
            SPID: PID,
          }
        : {};

    UpdateData(type, user_name, upData);

    if (type === "liked_posts" || type === "unliked_posts") setLiked(value);
    if (type === "shared_posts" || type === "unshared_posts") setShared(value);
    if (type === "saved_posts" || type === "unsaved_posts") setSaved(value);
  };

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

    for (let i = 0; i < admin?.liked_post?.arrayValue?.values?.length; i++) {
      const likedPost = admin?.liked_post?.arrayValue?.values[i];

      likedPost?.mapValue.fields.LPID?.stringValue === PID && setLiked(true);
    }
    for (let i = 0; i < admin?.shared_posts?.arrayValue?.values?.length; i++) {
        const shared_post = admin?.shared_posts?.arrayValue?.values[i];
  
        shared_post?.mapValue.fields.SHPID?.stringValue === PID && setShared(true);
      }
      for (let i = 0; i < admin?.saved_posts?.arrayValue?.values?.length; i++) {
        const saved_post = admin?.saved_posts?.arrayValue?.values[i];
  
        saved_post?.mapValue.fields.SPID?.stringValue === PID && setSaved(true);
      }
  }, []);

  useEffect(() => {
    imgUrl("post");
    imgUrl("profile");
  }, [storyImgs]);

  useEffect(() => {
    list("post");
    list("profile");

    imgUrl("post");
    imgUrl("profile");

    setCount(count + 1);
  }, [hasNewStory, UserData, admin, storyImgs, postImgs]);

  const UID = data.UID.stringValue;

  if (hasPostD)
    return (
      <section className=" flex flex-col py-2  gap-2 rounded-md bg-[#242526] w-full ">
        <div className=" w-full h-[50px] p-3 flex justify-between items-center ">
          <div className=" w-auto h-fulll py-2 flex justify-start items-start ">
            <NavLink to={`/${UID}`} className=" rounded-full  bg-[#333333] ">
              <img
                className=" w-[40px] p-1 h-[40px] rounded-full object-cover cursor-pointer "
                src={userProfile?.length > 0 ? userProfile : userAvatar}
                alt=""
                srcset=""
              />
            </NavLink>
            <NavLink
              to={`/${UID}`}
              className=" cursor-pointer px-2 py-1 w-auto justify-start items-start text-sm h-full "
            >
              <p>{name}</p>
            </NavLink>
          </div>
        </div>

        <pre className=" p-3 ">
          {
            data?.post.arrayValue.values[0]?.mapValue.fields.caption
              ?.stringValue
          }
        </pre>

        <img className=" w-full " src={postUrl} alt="" srcset="" />

        <div className=" flex justify-between items-center py-2 px-3 ">
          <div className=" flex gap-3 items-center  ">
            {liked ? (
              <div
                onClick={() => postAction("unliked_posts", false)}
                className=" text-[#CA3E47] flex p-1 items-center cursor-pointer rounded-full "
              >
                <Icon path={mdiHeart} size={1} />
              </div>
            ) : (
              <div
                onClick={() => postAction("liked_posts", true)}
                className=" flex p-1 items-center cursor-pointer rounded-full "
              >
                <Icon path={mdiHeartOutline} size={1} />
              </div>
            )}

            <div className=" flex p-1 items-center cursor-pointer rounded-full ">
              <Icon path={mdiChatOutline} size={1} />
            </div>
                {
                    shared ?   <div
                    onClick={() => postAction("unshared_posts", false)}
                    className=" flex p-1 items-center cursor-pointer rounded-full "
                  >
                    <Icon path={mdiShare} size={1} />
                  </div> :   <div
              onClick={() => postAction("shared_posts", true)}
              className=" flex p-1 items-center cursor-pointer rounded-full "
            >
              <Icon path={mdiShareOutline} size={1} />
            </div>
                }
          
          </div>

          {
            saved ?  <div
            onClick={() => postAction("unsaved_posts", false)}
            className=" flex p-1 items-center cursor-pointer rounded-full "
          >
            <Icon path={mdiBookmark} size={1} />
          </div> :  <div
            onClick={() => postAction("saved_posts", true)}
            className=" flex p-1 items-center cursor-pointer rounded-full "
          >
            <Icon path={mdiBookmarkOutline} size={1} />
          </div>
          }

         
        </div>
      </section>
    );
};

export default PostCard;
