import { getDownloadURL, listAll, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { storage } from "../../firebase/firebase";
import { NavLink, useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import classes from "./CarouselCard.module.css";
import { Carousel } from "flowbite-react";

import {
  mdiBookmark,
  mdiBookmarkOutline,
  mdiChevronLeft,
  mdiChevronRight,
  mdiContentCopy,
  mdiDotsHorizontal,
  mdiHeart,
  mdiHeartOutline,
  mdiShare,
  mdiShareOutline,
} from "@mdi/js";
import UpdateData from "../../redux/services/Hooks/UpdateData";
import ImageCard from "./ImageCard";

const PostCard = ({ name, data }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { userAvatar, UserData, admin, hasNewStory } = useSelector(
    (deserializedState) => deserializedState.authSlice 
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
    const [loading, setLoading] = useState(true);

    const UID = data.UID.stringValue;

    const POID = hasPostD ? data.UID.stringValue : "0";

    const PID = hasPostD ? d?.mapValue?.fields?.PID?.stringValue : "0";

    const user_name = admin?.user_name.stringValue;
    const USID = admin?.UID.stringValue;

    const likes = data?.likes
      ? data.likes?.arrayValue.values?.filter(
          (d) => d.mapValue.fields.PID.stringValue === PID
        )
      : 0;
    const shares = data?.shares
      ? data.shares?.arrayValue?.values?.filter(
          (d) => d.mapValue.fields.PID.stringValue === PID
        )
      : 0;

    const [likeC, setLikeC] = useState(likes?.length > 0 ? likes?.length : 0);
    const [shareC, setShareC] = useState(
      shares?.length > 0 ? shares?.length : 0
    );

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

      const upUData = {
        UID: USID,
        user_name: user_name,
        PID: PID,
      };

      UpdateData(type, USID, UID, upData, upUData);

      if (type === "liked_posts" || type === "unliked_posts") {
        setLiked(value);
        type === "liked_posts" ? setLikeC(likeC + 1) : setLikeC(likeC - 1);
      }
      if (type === "shared_posts" || type === "unshared_posts") {
        setShared(value);
        type === "shared_posts" ? setShareC(shareC + 1) : setShareC(shareC - 1);
      }
      if (type === "saved_posts" || type === "unsaved_posts") setSaved(value);
    };

    async function postUrlGen(path) {
      let u = [];
      path?.map(
        async (d) =>
          await getDownloadURL(ref(storage, d.fullPath)).then((data) => {
            setLoading(false);
            u.push(data);
            setPostUrl([...postUrl, u]);
          })
      );
    }

    const imgUrl = async (path) => {
      const urls = await getDownloadURL(ref(storage, path));

      setUserProfile(urls);
      localStorage.setItem('userProfile',urls)
    };

    const storageRef = ref(
      storage,
      `user_photo/${data?.UID?.stringValue}/${
        hasPf &&
        data?.profile?.arrayValue?.values[0]?.mapValue?.fields?.PFID
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

    const[postMenu,setPostMenu] = useState(false)

    const link = `localhost:5173/${UID}/post_detail/${PID}`

  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    const a = document.getElementById('linkToCopy')
    const baseURI = a?.baseURI
    try {
      await navigator.clipboard.writeText(`${baseURI}${UID}/post_detail/${PID}`);
      setCopied(true);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    return () => clearTimeout(timeout);
  }, [copied]);
    
   const caption = data?.post.arrayValue.values.find( d => d.mapValue.fields.PID.stringValue === PID )?.mapValue.fields.caption.stringValue

  //  console.log(caption)

      return (
        <section
          id="mw"
          className=" snap-center relative border-b border-[#d4d4d46d] flex flex-col justify-start items-center   py-4    w-full "
        >
          <div className=" flex w-full h-auto rounded-t-md justify-between  ">
            <div className="  w-full  flex-col relative   rounded-tl-md h-auto min-h-[50px]  flex justify-between items-end ">
              <div className=" absolute bottom-2 left-0 w-full px-2  h-[45px]   flex justify-between items-center ">
                <div className=" w-auto h-full  gap-2    flex justify-center items-center ">
                  <NavLink
                  onClick={()=> localStorage.setItem('userProfile',userProfile) }
                    to={`/${UID}`}
                    className=" rounded- relative w-[40px]  h-[40px] justify-center items-center   "
                  >
                    <div className=" -z-10 rotate-[0deg] rounded-sm  left-[1px] top-[1px] bg-[#ca3e4796] w-[38px] h-[38px] absolute "></div>
                    <div className=" -z-10 rotate-[20deg] rounded-sm left-[1px] top-[1px] bg-[#ca3e4796] w-[38px] h-[38px] absolute "></div>
                    <div className=" -z-10 rotate-[40deg] left-[1px] rounded-sm top-[1px] bg-[#ca3e4796] w-[38px] h-[38px] absolute "></div>
                    <div className=" -z-10 rotate-[60deg] left-[1px] top-[1px] rounded-sm bg-[#ca3e4796] w-[38px] h-[38px] absolute "></div>
                    <div className=" -z-10 rotate-[80deg] left-[1px] top-[1px] rounded-sm bg-[#ca3e4796] w-[38px] h-[38px] absolute "></div>

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

              <div onClick={()=>{
                setPostMenu(!postMenu)
                console.log(postMenu);
                
                }} className=" transition-transform absolute right-0 bottom-2 w-[40px] bg-[#3333332f] h-[40px] flex justify-center items-center rounded  cursor-pointer ">
                <Icon path={mdiDotsHorizontal} size={1} />
              </div>
              <section style={{
                visibility: postMenu ? 'visible' :'collapse'
              }} className=" z-[9999] transition-transform   text-sm tracking-wide flex flex-col gap-2 p-1 rounded-md bg-[#31313157] backdrop-blur absolute right-2 top-12 min-w-[25%] min-h-[40px] " >
                    <div onClick={copyToClipboard } className="flex gap-1 cursor-pointer hover:bg-[#24252657] p-2 rounded-md  justify-center items-center" >
                    <Icon path={mdiContentCopy} size={0.8} />
                    <a id="linkToCopy"  href={link} ></a>
                    <p>{copied ? 'Copied!' : 'Copy Link'}</p>
                    </div>
                   

              </section>
            </div>
          </div>

          { !loading ?
           postUrl[0].length > 1 ? (
            <Carousel loop={false} slideInterval={0} slide={false}>
              {postUrl[0]?.map((d) => {
                
                return <ImageCard UID={UID} PID={PID} key={d+1134} data={d} />;
              })}
            </Carousel>
          ) : (
            postUrl[0]?.map((d) => {
              return <ImageCard UID={UID} PID={PID}  key={d+124} data={d} />;
            })
          )
          :
          <div className=" w-full h-[500px] bg-[#3333332f] rounded-md opacity-[0.5]  " >

          </div>
        }

          <div className=" flex flex-col w-full justify-between items-center py-2  ">
            <div className=" flex w-full justify-between items-center  ">
              <div className=" flex gap-3 items-center  ">
                {liked ? (
                  <div className=" text-[#CA3E47] flex p-1 gap-1 items-center cursor-pointer rounded-full ">
                    <Icon
                      onClick={() => postAction("unliked_posts", false)}
                      path={mdiHeart}
                      size={1}
                    />{" "}
                    {likeC !== 0 && (
                      <span className=" text-sm ">
                        {" "}
                        {likeC} {likeC > 1 ? "likes" : "like"}{" "}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className=" flex p-1 items-center cursor-pointer rounded-full ">
                    <Icon
                      onClick={() => postAction("liked_posts", true)}
                      path={mdiHeartOutline}
                      size={1}
                    />{" "}
                    {likeC !== 0 && (
                      <span className=" text-sm ">
                        {" "}
                        {likeC} {likeC > 1 ? "likes" : "like"}{" "}
                      </span>
                    )}
                  </div>
                )}

                {shared ? (
                  <div className=" flex p-1 items-center gap-1 cursor-pointer rounded-full ">
                    <Icon
                      onClick={() => postAction("unshared_posts", false)}
                      path={mdiShare}
                      size={1}
                    />
                    {shareC !== 0 && (
                      <span className=" text-sm ">
                        {" "}
                        {shareC} {shareC > 1 ? "shares" : "share"}{" "}
                      </span>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => postAction("shared_posts", true)}
                    className=" flex p-1 items-center cursor-pointer rounded-full "
                  >
                    <Icon
                      onClick={() => postAction("shared_posts", true)}
                      path={mdiShareOutline}
                      size={1}
                    />{" "}
                    {shareC !== 0 && (
                      <span className=" text-sm ">
                        {" "}
                        {shareC} {shareC > 1 ? "shares" : "share"}{" "}
                      </span>
                    )}
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
          {caption && (
            <pre className="  border-l-[1.5px] border-[#d4d4d4ce] px-2 py-2 text-sm  max-w-[80%] text-wrap tracking-wide self-start  w-[80%]  h-auto ">
              {
                caption
              }
            </pre>
          )}
        </section>
      );
  });
};

export default PostCard;
