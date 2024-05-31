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
  mdiChevronLeft,
  mdiChevronRight,
  mdiDotsHorizontal,
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
    const [postImgs, setPostImgs] = useState([]);
    const [postUrl, setPostUrl] = useState([]);
    const [count, setCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [shared, setShared] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading,setLoading] = useState(true)

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

    const postUrlGen = async (path) => {
      let u = [];

      path?.map(
        async (d) =>
          await getDownloadURL(ref(storage, d.fullPath)).then((data) => {
            u?.push(data);
            setPostUrl(u);
           postUrl?.length > 0 && setLoading(false)
          })
      );
    };

    const imgUrl = async (path) => {
      const urls = await getDownloadURL(ref(storage, path));

      setUserProfile(urls);
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

    const list = async () => {
      const not = await listAll(storageRef).then((data) => {
        imgUrl(data?.items[0]?.fullPath);
      });
    };

    const postList = async () => {
      await listAll(postRef).then((data) => postUrlGen(data.items));
    };

    useEffect(() => {
      list();
      postList();

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
      list();
      postList();

      setCount(count + 1);
    }, [hasNewStory, UserData, admin, storyImgs, postImgs]);

    

    const { isTablet, isMobile, isDeskTop } = useSelector(
      (state) => state.animateSlice
    );

    const [translateX, setTranslateX] = useState(0);
    const [countC, setCountC] = useState(0);

    const imgW = document.getElementById("imgW");
    const iw = imgW?.clientWidth;
    const ih = imgW?.offsetHeight;

    const next = () => {
      if (countC < postUrl.length - 1) {
        setTranslateX(translateX - iw);
        setCountC(countC + 1);
      }
    };

    const prev = () => {
      if (countC > 0) {
        setTranslateX(translateX + iw);
        setCountC(countC - 1);
      }
    };

  if(!loading)  return (
      <section className=" snap-center relative border-b border-[#d4d4d46d] flex flex-col justify-start items-start   py-4    w-full ">
        <div className=" flex w-full h-auto rounded-t-md justify-between  ">
          <div className="  w-full  flex-col relative   rounded-tl-md h-auto min-h-[50px]  flex justify-between items-end ">
            <div className=" absolute bottom-2 left-0 w-full px-2  h-[45px]   flex justify-between items-center ">
              <div className=" w-auto h-full  gap-2    flex justify-center items-center ">
                <NavLink
                  to={`/${UID}`}
                  className=" rounded- relative w-[40px]  h-[40px] justify-center items-center  bg-[#ca3e4796] "
                >
                  <div className=" -z-10 rotate-[10deg] left-[1px] top-[1px] bg-[#ca3e4796] w-[38px] h-[38px] absolute "></div>
                  <div className=" -z-10 rotate-[20deg] left-[1px] top-[1px] bg-[#ca3e4796] w-[38px] h-[38px] absolute "></div>
                  <div className=" -z-10 rotate-[40deg] left-[1px] top-[1px] bg-[#ca3e4796] w-[38px] h-[38px] absolute "></div>
                  <div className=" -z-10 rotate-[60deg] left-[1px] top-[1px] bg-[#ca3e4796] w-[38px] h-[38px] absolute "></div>
                  <div className=" -z-10 rotate-[80deg] left-[1px] top-[1px] bg-[#ca3e4796] w-[38px] h-[38px] absolute "></div>

                  <img
                    className=" w-full   h-full rounded-full object-cover cursor-pointer "
                    src={userProfile?.length > 0 ? userProfile : userAvatar}
                    alt=""
                    srcset=""
                  />
                </NavLink>
                <NavLink
                  to={`/${UID}`}
                  className=" cursor-pointer rounded-br px-2  h-full min-w-[100px]  w-auto flex justify-start items-center tracking-wide text-base  "
                >
                  <p>{name}</p>
                </NavLink>
              </div>
            </div>

            <div className=" absolute right-0 bottom-2 w-[40px] bg-[#3333332f] h-[40px] flex justify-center items-center rounded  cursor-pointer ">
              <Icon path={mdiDotsHorizontal} size={1} />
            </div>
          </div>
        </div>

        {postUrl?.length > 1 && !isMobile && (
          <div className=" absolute flex justify-between top-[50%] z-10 w-full ">
             <div
             style={{
                opacity: countC > 0 ? '1' : '0'
             }}
                onClick={() => prev()}
                className=" cursor-pointer self-start  p-1  bg-[#33333399] backdrop-blur rounded-full "
              >
                <Icon path={mdiChevronLeft} size={1} />
              </div>
            
           


             <div style={{
                opacity: countC < postUrl?.length-1 ? '1' : '0'
             }}
                
                    onClick={() => next()}
                    className=" cursor-pointer self-end  p-1 bg-[#33333399] backdrop-blur rounded-full "
                  >
                    <Icon path={mdiChevronRight} size={1} />
                  </div>
                
         
          </div>
        )}

          <div
            style={{
              overflowX: isMobile ? "scroll" : "hidden",
              height:ih>0 ? ih+'px' :'500px'
            }}
            className=" flex relative    bg-[#3333334f]   rounded-md snap-x  snap-mandatory overflow-y-hidden  w-full gap-1 "
          >
            <div
              style={{
                left: translateX + "px",
              }}
              className=" flex absolute  h-auto w-full  justify-start  rounded-md     "
            >
              {postUrl?.map((d) => {
                return (
                  <img
                    key={d}
                    id="imgW"
                    className="  bg-[#242526] min-h-[500px]   snap-center transition-all w-full object-cover object-top rounded-md "
                    src={d}
                    alt=""
                    srcset=""
                  />
                );
              })}
            </div>
          </div> 
  
        

      
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
        {data?.post.arrayValue.values[0]?.mapValue.fields.caption
          ?.stringValue && (
          <pre className="  border-l-[1.5px] border-[#d4d4d4ce] px-2 py-2 text-sm  max-w-[80%] text-wrap tracking-wide  w-[80%]  h-auto ">
            {
              data?.post.arrayValue.values[0]?.mapValue.fields.caption
                ?.stringValue
            }
          </pre>
        )}
      </section>
    );
  });
};

export default PostCard;
