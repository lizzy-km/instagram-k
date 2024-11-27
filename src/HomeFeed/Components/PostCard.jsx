import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { Carousel } from "flowbite-react";

import {
  mdiBookmark,
  mdiBookmarkOutline,
  mdiContentCopy,
  mdiDeleteAlertOutline,
  mdiDeleteForever,
  mdiDeleteForeverOutline,
  mdiDeleteOutline,
  mdiDotsHorizontal,
  mdiHeart,
  mdiHeartOutline,
  mdiShare,
  mdiShareOutline,
} from "@mdi/js";
import UpdateData from "../../redux/services/Hooks/UpdateData";
import ImageCard from "./ImageCard";
import { setUpdateFeed } from "../../redux/services/authSlice";

const PostCard = ({ name, data }) => {
  const { userAvatar, UserData, admin, hasNewStory,updateFeed } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const PostImg =
    data?.POST_DETAIL?.mapValue.fields.POST_IMAGE_PATH?.arrayValue.values;

  const hasPostD = data?.PID?.stringValue?.length > 0;

  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const realTime = Date.now(); //Date Now
  const intg = data.UPLOADED_AT?.integerValue;
  const tsm = data.UPLOADED_AT?.timestampValue;

  const diffUpTimeINMilSec = new Date(tsm);
  const TimeInMilliSec = diffUpTimeINMilSec.getTime();
  const uploaded_at = intg ? intg : TimeInMilliSec; //Post Uploaded Date from api

  const diffDate = realTime - uploaded_at;

  const [time, setTime] = useState("");

  const timeInSec = (diffDate / 1000).toFixed(0);
  const timeINMin = (timeInSec / 60).toFixed(0);
  const timeInHr = (timeINMin / 60).toFixed(0);
  const timeInDay = (timeInHr / 24).toFixed(0);
  const timeInWk = (timeInDay / 7).toFixed(0);
  const timeInMon = (timeInWk / 4).toFixed(0);
  const timeInYr = (timeInMon / 12).toFixed(0);

  useEffect(() => {
    timeInMon > 12
      ? setTime(`${timeInYr}Y`)
      : timeInWk > 4
      ? setTime(`${timeInMon}M`)
      : timeInDay > 7
      ? setTime(`${timeInWk}W`)
      : timeInHr > 23
      ? setTime(`${timeInDay}D`)
      : timeINMin > 60
      ? setTime(`${timeInHr}H`)
      : timeInSec > 60
      ? setTime(`${timeINMin}m`)
      : timeInSec < 60
      ? setTime(`just now`)
      : 0;
  }, []);

  const POD = data?.POST_OWNER_DETAIL?.mapValue.fields;
  const UID = POD.POID.stringValue;

  const POID = hasPostD ? UID : "0";

  const PID = hasPostD ? data?.PID.stringValue : "0";

  const userPfData = UserData.filter((data) => data.id === POID)[0]?._document
    .data.value.mapValue.fields.profile.arrayValue.values[0]?.mapValue.fields;

  const user_name = admin?.user_name.stringValue;
  const USID = admin?.UID.stringValue;

  // console.log(data?.POST_DETAIL?.mapValue.fields?.SHARES?.arrayValue.values);

  const likes = data?.POST_DETAIL?.mapValue.fields?.LIKES?.arrayValue.values
    ? data.POST_DETAIL?.mapValue.fields?.LIKES?.arrayValue.values?.filter(
        (d) => d?.mapValue.fields?.PID?.stringValue === PID
      )
    : 0;
  const shares = data?.POST_DETAIL?.mapValue.fields?.SHARES?.arrayValue.values
    ? data.POST_DETAIL?.mapValue.fields?.SHARES?.arrayValue.values?.filter(
        (d) => d?.mapValue.fields?.PID?.stringValue === PID
      )
    : 0;

  const [likeC, setLikeC] = useState(likes?.length > 0 ? likes?.length : 0);
  const [shareC, setShareC] = useState(shares?.length > 0 ? shares?.length : 0);

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
      POID: POID,
      PON: user_name,
      PID: PID,
    };

    UpdateData(type, USID, PID, upData, upUData);

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

  useEffect(() => {
    if (data) {
      setLoading(false);
    }

    for (let i = 0; i < admin?.liked_post?.arrayValue?.values?.length; i++) {
      const likedPost = admin?.liked_post?.arrayValue?.values[i];

      likedPost?.mapValue.fields?.LPID?.stringValue === PID && setLiked(true);
    }

    for (let i = 0; i < admin?.shared_posts?.arrayValue?.values?.length; i++) {
      const shared_post = admin?.shared_posts?.arrayValue?.values[i];


      shared_post?.mapValue.fields?.SHPID?.stringValue === PID &&
        setShared(true);
    }
    for (let i = 0; i < admin?.saved_posts?.arrayValue?.values?.length; i++) {
      const saved_post = admin?.saved_posts?.arrayValue?.values[i];

      saved_post?.mapValue.fields?.SPID?.stringValue === PID && setSaved(true);
    }
  }, []);

  useEffect(() => {
    setCount(count + 1);
  }, [hasNewStory, UserData, admin]);

  const [postMenu, setPostMenu] = useState(false);

  const link = `localhost:5173/${UID}/post_detail/${PID}`;

  const [copied, setCopied] = useState(false);

  const [deleted, setDeleted] = useState(false);

  const copyToClipboard = async () => {
    const a = document.getElementById("linkToCopy");
    const baseURI = a?.baseURI;
    try {
      await navigator.clipboard.writeText(
        `${baseURI}${UID}/post_detail/${PID}`
      );
      setCopied(true);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const dispatch = useDispatch();

  useEffect(() => {
    deleted === true && dispatch(setUpdateFeed(+1));
  }, [deleted]);

  useEffect(() => {
    const timeout = setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    return () => clearTimeout(timeout);
  }, [copied]);

  const caption = data?.POST_DETAIL?.mapValue.fields?.POST_CAPTION?.stringValue;

  const deletePost = async (type, PID) => {
    UpdateData(type, "USID", PID, "upData", "upUData")
      .then((data) => {
        setDeleted(true);
        dispatch(setUpdateFeed(!updateFeed));
      })
      .catch((error) => console.log(error));
  };

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
                onClick={() =>
                  localStorage.setItem(
                    "userProfile",
                    userPfData?.PFPATH?.stringValue
                  )
                }
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
                  src={
                    userPfData?.PFPATH?.stringValue?.length > 0
                      ? userPfData?.PFPATH?.stringValue
                      : userAvatar
                  }
                  alt=""
                  srcset=""
                />
              </NavLink>
              <NavLink
                to={`/${UID}`}
                className=" flex-col cursor-pointer rounded-br px-2  h-full min-w-[100px]  w-auto flex justify-start items-start tracking-wide text-base  "
              >
                <p>{name}</p>
                <time
                  dateTime={uploaded_at}
                  datatype="UTC"
                  className=" opacity-75 text-[12px] "
                >
                  {" "}
                  {time}{" "}
                </time>
              </NavLink>
            </div>
          </div>

          <div
            onClick={() => {
              setPostMenu(!postMenu);
              //log(postMenu);
            }}
            className=" transition-transform absolute right-0 bottom-2 w-[40px] bg-[#3333332f] h-[40px] flex justify-center items-center rounded  cursor-pointer "
          >
            <Icon path={mdiDotsHorizontal} size={1} />
          </div>
          <section
            style={{
              visibility: postMenu ? "visible" : "collapse",
            }}
            className=" z-[9999] transition-transform   text-sm tracking-wide flex flex-col gap-2 p-2 rounded-md bg-[#31313157] backdrop-blur absolute right-2 top-12 min-w-[25%] min-h-[40px] "
          >
            <div
              onClick={copyToClipboard}
              className="flex gap-1 cursor-pointer  hover:bg-[#33333357] p-2 rounded-md  justify-start items-center"
            >
              <Icon path={mdiContentCopy} size={0.8} />
              <a id="linkToCopy" href={link}></a>
              <p>{copied ? "Copied!" : "Copy Link"}</p>
            </div>

            {POID === USID && (
              <div
                onClick={() => deletePost("delete_user_post", PID)}
                className="flex gap-1 cursor-pointer hover:bg-[#33333357] p-2 rounded-md  justify-start items-center"
              >
                <Icon path={mdiDeleteForeverOutline} size={0.9} />
                <a id="linkToCopy" href={link}></a>
                <p>{deleted ? "Deleted!" : "Delete"}</p>
              </div>
            )}
          </section>
        </div>
      </div>

      {!loading ? (
        PostImg?.length > 1 ? (
          <Carousel loop={false} slideInterval={0} slide={false}>
            {PostImg?.map((d) => {
              const url = d.mapValue.fields?.downloadURL?.stringValue;
              return (
                <ImageCard UID={UID} PID={PID} key={url} data={d} url={url} />
              );
            })}
          </Carousel>
        ) : (
          PostImg?.map((d) => {
            const url = d.mapValue.fields.downloadURL.stringValue;
            return (
              <ImageCard UID={UID} PID={PID} key={url} data={d} url={url} />
            );
          })
        )
      ) : (
        <div className=" w-full h-[500px] bg-[#3333332f] rounded-md opacity-[0.5]  "></div>
      )}

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
          {caption}
        </pre>
      )}
    </section>
  );
};

export default PostCard;
