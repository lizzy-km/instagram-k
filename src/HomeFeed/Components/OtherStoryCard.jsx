import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const OtherStoryCard = ({ data, translateX }) => {
  const storyVideo =
    data?._document.data.value.mapValue.fields.vid_src?.stringValue;
  const storyImg =
    data?._document.data.value.mapValue.fields.img_src?.stringValue;
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const { UserData } = useSelector((state) => state.authSlice);




  const user = UserData.length > 0 && UserData?.filter((d) => d[0]?._document?.data.value.mapValue.fields.UID?.stringValue === data?._document?.data.value.mapValue.fields.STUID?.stringValue)[0][0]?._document?.data.value.mapValue.fields


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

  

    return (
      <div
        style={{
          translate: -translateX,
        }}
        className="  tracking-wider flex min-w-[140.6px] h-full bg-[#242526] rounded-md "
      >
        <div className=" relative flex flex-col justify-between items-start w-full h-full rounded-md ">
          <div className="h-[100%] absolute  bg-center object-center    object-cover rounded-md ">
            {storyImg?.length > 0 ? (
              <img
                className=" cursor-pointer hover:brightness-75 brightness-95 hover:size-[102%] h-[100%]  bg-center object-center    object-cover rounded-md "
                src={storyImg}
                alt="profile_picture"
                srcSet=""
              />
            ) : (
              <video
                className=" rounded-md cursor-pointer "
                ref={videoRef}
                src={storyVideo}
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
          </div>

          <div className=" z-[9] p-2  w-full h-[50px] flex justify-start items-start  ">
            <div className=" cursor-pointer  flex rounded-full w-[40px] h-[40px] p-[3px] bg-[#0866ff] ">
              {user?.profile_picture?.arrayValue.values.map((d) => {
                return (
                  <>
                    {d.mapValue.fields.isActive.booleanValue === true ? (
                      <img
                        className=" z-[99] rounded-full object-cover w-full h-full "
                        src={d?.mapValue.fields.src?.stringValue}
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
