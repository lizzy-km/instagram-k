import React, { useEffect, useRef, useState } from "react";

const StoryCard = ({translateX}) => {
    const storyVideo = 'https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2FStory_Video.mp4?alt=media&token=b28f5198-3080-4168-9283-f85d5e083c20'
    const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

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
      translate:-translateX
    }}
     className="  tracking-wider flex min-w-[140.6px] h-full bg-[#242526] rounded-md ">
        <div className=" relative flex flex-col justify-between items-start w-full h-full rounded-md " >
        <div className="h-[100%] absolute  bg-center object-center    object-cover rounded-md ">
              {/* <img
                className=" cursor-pointer hover:brightness-75 brightness-95 hover:size-[102%] h-[100%]  bg-center object-center    object-cover rounded-md "
                src="https://i.pinimg.com/originals/01/ff/ca/01ffca16c11857f7260c2e9a82e53518.jpg"
                alt="profile_picture"
                srcSet=""
              /> */}
              <video   className=" rounded-md cursor-pointer "
              ref={videoRef} 
              src={storyVideo} 
              onClick={handlePlayPause}
              onMouseEnter={()=>{
                videoRef.current.play()
                setIsPlaying(true)
            }}
              onMouseLeave={()=>{
                videoRef.current.pause()
                setIsPlaying(false)
            }}
              >
                
              </video>
            </div>

            <div className=" z-[9] p-2  w-full h-[50px] flex justify-start items-start  " >
                <div className=" cursor-pointer  flex rounded-full w-[40px] h-[40px] p-[3px] bg-[#0866ff] " >
                    <img className=" rounded-full object-cover w-full h-full "  src="https://i.pinimg.com/originals/33/9c/62/339c62a0f474a488aa8794a4bf4f3afc.jpg" alt="" srcSet="" />
                </div>
            </div>


            
              <div className=" rounded-b-md relative z-[9] w-full p-0 " >
                
              <div className="  bg-img rounded-b-md    text-[#d1d1d1] font-[450]  " >
                <p className=" p-2 flex w-full h-full backdrop-shadow " >Babymonster</p>
            </div>
              </div>
            
        </div>
    </div>
  );
};

export default StoryCard;
