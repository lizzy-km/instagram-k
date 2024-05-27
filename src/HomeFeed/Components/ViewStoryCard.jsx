import { getDownloadURL, listAll, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {  useSelector } from "react-redux";
import { storage } from "../../firebase/firebase";

const ViewStoryCard = ({ userData }) => {
  const { storyId } = useSelector((state) => state.authSlice);

  const data = userData?.filter(
    (d) =>
      d?._document.data.value.mapValue.fields?.story?.arrayValue.values[0]
        ?.mapValue.fields.STID.stringValue === storyId
  )[0]?._document.data.value.mapValue.fields;

  const UID = data?.UID.stringValue;
  const STID =
    data?.story?.arrayValue.values[0]?.mapValue.fields?.STID.stringValue;
  const UserName = data?.user_name?.stringValue;
  const PFID =
    data?.profile_picture?.arrayValue.values[0]?.mapValue.fields.PFID
      .stringValue;

  const [imgPath, setImgPath] = useState("");
  const [profileUrl, setProfileUrl] = useState();

  //   Get User Profile Image Url From Firebase Storage
  const imgUrl = async () => {
    const urls = await getDownloadURL(ref(storage, imgPath));
    setProfileUrl(urls);
  };

  const storageRef = ref(storage, `user_photo/${UID}/${PFID}`);

  const list = async () => {
    const not = await listAll(storageRef);

    for (let ii = 0; ii < not?.items.length; ii++) {
      setImgPath(not.items[ii]?.fullPath);
    }
  };

  useEffect(() => {
    list();
    storyId.length > 0 && setStoryD('')
  }, [storyId]);

  useEffect(() => {
    imgUrl();
  }, [imgPath]);

  const [storySrc, setStorySrc] = useState();
  const [storyD, setStoryD] = useState();

  const storyUrl = async () => {
    const urls = await getDownloadURL(ref(storage, storySrc));
    setStoryD(urls);
  };

  const storyeRef = ref(storage, `user_story/${UID}/${STID}`);

  const storyList = async () => {
    const not = await listAll(storyeRef);

    for (let ii = 0; ii < not?.items.length; ii++) {
      setStorySrc(not.items[ii]?.fullPath);
    }
  };

  useEffect(() => {
    storyList();
  }, [storyId]);

  useEffect(() => {
    storyUrl();
  }, [storySrc]);

  return (
    <div className="  h-full relative w-[45%] rounded-md flex justify-start items-start ">
      <div
        className={` z-[99] rounded-t-md backdrop-brightness-[80px] bg-[#21212145] backdrop-blur  cursor-pointer flex w-[100%]  gap-3 p-2 `}
      >
        <div className=" flex justify-center items-center p-1 rounded-full bg-[#212121] ">
          <img
            className=" w-[45px] h-[45px] rounded-full object-cover object-center "
            src={profileUrl}
            alt=""
            srcset=""
          />
        </div>

        <div className=" flex py-1 justify-start items-center ">
          <p className=" p-1 text-center w-full h-full "> {UserName} </p>
        </div>
      </div>

      {storyD && (
        <img
          className=" absolute cursor-pointer w-full h-full object-cover rounded-md "
          src={storyD}
          alt=""
          srcset=""
        />
      )}
    </div>
  );
};

export default ViewStoryCard;
