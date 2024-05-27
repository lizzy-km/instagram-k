import { getDownloadURL, listAll, ref } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { storage } from "../../firebase/firebase";

const OtherStoryCard = ({ data, translateX }) => {

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const { UserData, admin,Story } = useSelector((state) => state.authSlice);

  const user =data?._document.data.value.mapValue.fields


const userStory = user.story.arrayValue.values[0].mapValue.fields



  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  useEffect(() => {
    if (isPlaying) {
      videoRef.current.play();
    }
  }, [isPlaying]);

  const userActivePf = user?.profile_picture?.arrayValue.values.filter(
    (d) => d.mapValue.fields
  )[0];

  const [storyImgs, setStoryImgs] = useState();

  const [userProfile, setUserProfile] = useState();


  const [storyImg, setStoryImg] = useState();
  const [storySrc, setStorySrc] = useState();
  const [storyD, setStoryD] = useState();

  const adminId = user?.UID?.stringValue;

  const storyUrl = async () => {
    const urls = await getDownloadURL(ref(storage, storySrc));
    setStoryD(urls);
  };

  const storyeRef = ref(
    storage,
    `user_story/${adminId}/${user.story.arrayValue.values[0].mapValue.fields?.STID?.stringValue}`
  );

  const storyList = async () => {
    const not = await listAll(storyeRef);

    for (let ii = 0; ii < not?.items.length; ii++) {
      setStorySrc(not.items[ii]?.fullPath);
    }
  };

  useEffect(() => {
    storyList();
  }, []);

  useEffect(() => {
    storyUrl();
  }, [storySrc]);

  // console.log(userActivePf);
  const imgUrl = async () => {
    const urls = await getDownloadURL(ref(storage, storyImgs));
    setUserProfile(urls);
  };

  const storageRef = ref(
    storage,
    `user_photo/${user?.UID?.stringValue}/${userActivePf?.mapValue.fields.PFID?.stringValue}`
  );

  const list = async () => {
    const not = await listAll(storageRef);

    for (let ii = 0; ii < not?.items.length; ii++) {
      setStoryImgs(not.items[ii]?.fullPath);
    }
  };

  useEffect(() => {
    list();
  }, []);

  useEffect(() => {
    imgUrl();
  }, [storyImgs]);

  if(storyD) return (
    <div
      style={{
        translate: -translateX,
      }}
      className="  tracking-wider flex min-w-[140.6px] h-full bg-[#242526] rounded-md "
    >
      <div className=" relative flex flex-col justify-between items-start w-full h-full rounded-md ">
        <div className="h-[100%] absolute  bg-center object-center    object-cover rounded-md ">
        {
                storyD && <img
                className=" cursor-pointer hover:brightness-75 brightness-95 hover:size-[102%] h-[100%]  bg-center object-center    object-cover rounded-md "
                src={storyD}
                alt="story_picture"
                srcSet=""
              />
              }
              {
                storyD &&  <video
                className=" rounded-md cursor-pointer "
                ref={videoRef}
                src={storyD}
                onClick={handlePlayPause}
                onMouseEnter={() => {
                  videoRef.current.play();
                  setIsPlaying(true);
                }}
                onMouseLeave={() => {
                  videoRef.current.pause();
                  setIsPlaying(false);
                }}
              ></video>
              }
        </div>

        <div className=" z-[9] p-2  w-full h-[50px] flex justify-start items-start  ">
          <div className=" cursor-pointer  flex rounded-full w-[40px] h-[40px] p-[3px] bg-[#0866ff] ">
            {user?.profile_picture?.arrayValue.values.map((d) => {
              return (
                <>
                  {d.mapValue.fields.isActive.booleanValue === true ? (
                    <img
                      className=" z-[99] rounded-full object-cover w-full h-full "
                      src={userProfile}
                      alt=""
                      srcSet=""
                    />
                  ) : null}
                </>
              );
            })}
          </div>
        </div>

        <div className=" rounded-b-md relative z-[9] w-full p-0 ">
          <div className="  bg-img rounded-b-md    text-[#d1d1d1] font-[450]  ">
            <p className=" p-2 flex w-full h-full backdrop-shadow ">
              {user?.user_name?.stringValue}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherStoryCard;
