import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStorage, getDownloadURL, ref, listAll } from "firebase/storage";
import { storage } from "../../firebase/firebase";
import { addAdminProfile, setStoryId } from "../../redux/services/authSlice";
import { setViewStory } from "../../redux/services/animateSlice";
import { NavLink } from "react-router-dom";

const StoryCard = ({ translateX }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const dispatch = useDispatch()
  const [count,setCount] = useState(0)

  const { UserData, admin, adminProfile,hasNewStory,userAvatar } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const [storyImgs, setStoryImgs] = useState();
  const [storySrc, setStorySrc] = useState();
  const [storyD, setStoryD] = useState();

  const adminId = localStorage.getItem("adminId");

  const isImage = admin.story?.arrayValue.values[0]?.mapValue.fields?.isImage?.booleanValue

  const STID = admin.story.arrayValue.values[0].mapValue.fields?.STID?.stringValue

  const storyUrl = async () => {
    const urls = await getDownloadURL(ref(storage, storySrc));
    setStoryD(urls);
  };

  const storyeRef = ref(
    storage,
    `user_story/${adminId}/${admin.story.arrayValue.values[0].mapValue.fields?.STID?.stringValue}`
  );

  const storyList = async () => {
    const not = await listAll(storyeRef);

    for (let ii = 0; ii < not?.items.length; ii++) {
      setStorySrc(not.items[ii]?.fullPath);
    }
  };

  useEffect(() => {
    storyList();
    storyUrl();

  }, []);

  useEffect(() => {


    storyUrl();
  }, [storySrc,count]);

  useEffect(()=> {
    storyList();
    storyUrl();

    setCount(count+1)
  },[admin])

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

  if (storyD?.length > 0)
    return (
      <div onClick={()=> {
        dispatch(setViewStory(true),
        dispatch(setStoryId(STID))
      )
      } }
        style={{
          translate: -translateX,
        }}
        className="   transition-all tracking-wider flex min-w-[145px] h-full bg-[#242526] rounded-md "
      >
        <div className=" relative scale-100 bg-[#242526] max-h-full flex flex-col justify-between items-start w-full h-full rounded-md ">
          <div className="h-[100%] scale-100  max-h-full bg-[#242526] absolute flex gap-1 justify-start items-center  bg-center object-center    object-cover rounded-md ">
            <>
              {isImage && (
                <img
                  className=" transition-all  cursor-pointer hover:brightness-75 brightness-95 hover:size-[102%] w-full  h-[100%]  bg-center object-center    object-cover rounded-md "
                  src={storyD?.length > 0 ? storyD:userAvatar}
                  alt="story_picture"
                  srcSet=""
                />
              )}
              {!isImage && (
                <video
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
              )}
            </>
          </div>

          <div className=" z-[9] p-2  w-full h-[50px] flex justify-start items-start  ">
            <NavLink  to={`/${adminId}`} onClick={()=> localStorage.setItem('userProfile',adminProfile) } className=" cursor-pointer  flex rounded-full   bg-[#CA3E47] ">
              <img
                className=" z-[99] rounded-full object-cover p-[3px] w-[40px] h-[40px] "
                src={adminProfile?.length > 10 ? adminProfile : userAvatar}
                alt=""
                srcSet=""
              />
            </NavLink>
          </div>

          <div className=" rounded-b-md relative z-[9] w-full p-0 ">
            <div className="  bg-img rounded-b-md    text-[#d1d1d1] font-[450]  ">
              <p className=" p-2 flex w-full h-full backdrop-shadow ">
                Your story
              </p>
            </div>
          </div>
        </div>
      </div>
    );
};

export default StoryCard;
