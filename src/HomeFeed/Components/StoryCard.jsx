import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStorage, getDownloadURL, ref, listAll } from "firebase/storage";
import { storage } from "../../firebase/firebase";
import { addAdminProfile } from "../../redux/services/authSlice";

const StoryCard = ({ translateX }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const [count,setCount] = useState(0)

  const { UserData, admin, adminProfile,hasNewStory } = useSelector(
    (state) => state.authSlice
  );

  const [storyImgs, setStoryImgs] = useState();
  const [storySrc, setStorySrc] = useState();
  const [storyD, setStoryD] = useState();

  const adminId = localStorage.getItem("adminId");

  const isImage = admin.story?.arrayValue.values[0]?.mapValue.fields?.isImage?.booleanValue

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
      <div
        style={{
          translate: -translateX,
        }}
        className="  tracking-wider flex min-w-[140.6px] h-full bg-[#242526] rounded-md "
      >
        <div className=" relative bg-[#242526] flex flex-col justify-between items-start w-full h-full rounded-md ">
          <div className="h-[100%] bg-[#242526] absolute flex gap-1 justify-start items-center  bg-center object-center    object-cover rounded-md ">
            <>
              {isImage && (
                <img
                  className=" cursor-pointer hover:brightness-75 brightness-95 hover:size-[102%] h-[100%]  bg-center object-center    object-cover rounded-md "
                  src={storyD}
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
            <div className=" cursor-pointer  flex rounded-full   bg-[#0866ff] ">
              <img
                className=" z-[99] rounded-full object-cover p-[3px] w-[40px] h-[40px] "
                src={adminProfile}
                alt=""
                srcSet=""
              />
            </div>
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
