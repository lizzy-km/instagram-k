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
  mdiDotsHorizontal,
  mdiDotsVertical,
  mdiHeart,
  mdiHeartOutline,
  mdiShare,
  mdiShareOutline,
} from "@mdi/js";
import UpdateData from "../../redux/services/Hooks/UpdateData";
const PostCard = ({ name, data }) => {
  const navigate = useNavigate();

  const { userAvatar, UserData, admin, hasNewStory } = useSelector(
    (state) => state.authSlice
  );

  const hasPf = data?.profile_picture?.arrayValue?.values?.length > 0;

  const hasPostD = data?.post?.arrayValue?.values?.length > 0;

  const post = hasPostD ? data?.post?.arrayValue?.values : [];

  return post.map((d) => {
    const [userProfile, setUserProfile] = useState();
    const [storyImgs, setStoryImgs] = useState();
    const [postImgs, setPostImgs] = useState();
    const [postUrl, setPostUrl] = useState();
    const [count, setCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [shared, setShared] = useState(false);
    const [saved, setSaved] = useState(false);

    const UID = data.UID.stringValue;

    const POID = hasPostD ? data.UID.stringValue : "0";

    const PID = hasPostD ? d?.mapValue?.fields?.PID?.stringValue : "0";

    const user_name = admin?.user_name.stringValue;
    const USID = admin?.UID.stringValue;

    const postAction = (type, value) => {
      const upData =
        type === "liked_posts" || type === "unliked_posts"
          ? {
              LPID: PID,
              POID: POID,
            }
          : type === "shared_posts" || type === "unshared_posts"
          ? {
              SHPID: PID,
              POID: POID,
            }
          : type === "saved_posts" || type === "unsaved_posts"
          ? {
              SPID: PID,
              POID: POID,
            }
          : {};

      UpdateData(type, USID, user_name, upData);

      if (type === "liked_posts" || type === "unliked_posts") setLiked(value);
      if (type === "shared_posts" || type === "unshared_posts")
        setShared(value);
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
        hasPostD && d?.mapValue?.fields?.PID?.stringValue
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

      for (
        let i = 0;
        i < admin?.shared_posts?.arrayValue?.values?.length;
        i++
      ) {
        const shared_post = admin?.shared_posts?.arrayValue?.values[i];

        shared_post?.mapValue.fields.SHPID?.stringValue === PID &&
          setShared(true);
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

    const bgImgEl = document.getElementById("bgImgLeft");
    const parentWidth = bgImgEl?.parentElement.clientWidth;
    const parentHeight = bgImgEl?.parentElement.clientHeight;

    const bgImgElR = document.getElementById("bgImgRight");
    const parentWidthR = bgImgElR?.parentElement.clientWidth;
    const parentHeightR = bgImgElR?.parentElement.clientHeight;

    return (
      <section className=" flex flex-col justify-start items-start   py-3    w-full ">
        <div className=" flex w-full h-auto rounded-t-md justify-between  ">
          <div className="  w-full  flex-col relative   rounded-tl-md h-auto min-h-[50px]  flex justify-between items-end ">
            <div className=" absolute bottom-2 left-0 w-[full] px-2  h-[50px] pb-2  flex justify-between items-center ">
              <div className=" w-auto h-full  gap-2   rounded-r  flex justify-end items-end ">
                <NavLink
                  to={`/${UID}`}
                  className=" rounded- relative  bg-[#ca3e4796] "
                >
                  <div className=" -z-10 rotate-[10deg] bg-[#ca3e4796] w-full h-full absolute "></div>
                  <div className=" -z-10 rotate-[20deg] bg-[#ca3e4796] w-full h-full absolute "></div>
                  <div className=" -z-10 rotate-[40deg] bg-[#ca3e4796] w-full h-full absolute "></div>
                  <div className=" -z-10 rotate-[60deg] bg-[#ca3e4796] w-full h-full absolute "></div>
                  <div className=" -z-10 rotate-[80deg] bg-[#ca3e4796] w-full h-full absolute "></div>





                  <img
                    className=" w-[40px]    h-[40px] rounded-full object-cover cursor-pointer "
                    src={userProfile?.length > 0 ? userProfile : userAvatar}
                    alt=""
                    srcset=""
                  />
                </NavLink>
                <NavLink
                  to={`/${UID}`}
                  className=" cursor-pointer rounded-br px-2  h-full min-w-[100px]  w-auto flex justify-start items-start text-base  "
                >
                  <p>{name}</p>
                </NavLink>
              </div>
            </div>

            <div className=" absolute right-0 bottom-2 w-[40px] bg-[#2121215a] h-[40px] flex justify-center items-center rounded  cursor-pointer ">
              <Icon path={mdiDotsVertical} size={1} />
            </div>
          </div>
        </div>

        <img className=" w-full " src={postUrl} alt="" srcset="" />

        <div className=" flex flex-col w-full justify-between items-center py-2  ">
          <div className=" flex w-full justify-between items-center  ">
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
              {shared ? (
                <div
                  onClick={() => postAction("unshared_posts", false)}
                  className=" flex p-1 items-center cursor-pointer rounded-full "
                >
                  <Icon path={mdiShare} size={1} />
                </div>
              ) : (
                <div
                  onClick={() => postAction("shared_posts", true)}
                  className=" flex p-1 items-center cursor-pointer rounded-full "
                >
                  <Icon path={mdiShareOutline} size={1} />
                </div>
              )}
            </div>

            {saved ? (
              <div
                onClick={() => postAction("unsaved_posts", false)}
                className=" flex p-2 items-center cursor-pointer rounded-full "
              >
                <Icon path={mdiBookmark} size={1} />
              </div>
            ) : (
              <div
                onClick={() => postAction("saved_posts", true)}
                className=" flex p-2  items-center cursor-pointer rounded-full "
              >
                <Icon path={mdiBookmarkOutline} size={1} />
              </div>
            )}
          </div>
        </div>

        <pre className="  border-l-[1.5px] border-[#d4d4d4ce] px-2  max-w-[80%] text-wrap tracking-wide  w-[80%]  h-auto ">
          {
            data?.post.arrayValue.values[0]?.mapValue.fields.caption
              ?.stringValue
          }
        </pre>
      </section>
    );
  });
};

export default PostCard;
