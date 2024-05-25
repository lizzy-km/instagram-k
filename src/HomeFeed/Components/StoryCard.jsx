import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStorage, getDownloadURL, ref, listAll } from "firebase/storage";
import { storage } from "../../firebase/firebase";
import { addAdminProfile } from "../../redux/services/authSlice";

const StoryCard = ({ translateX, data }) => {
  const storyVideo = data
  const storyImg = data
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);


  const { UserData,admin,adminProfile } = useSelector((state) => state.authSlice);

  const [storyImgs, setStoryImgs] = useState();

  const user = UserData?.filter(
    (d) => d?.UID?.stringValue === data.STUID?.stringValue
  )[0];



  const userActivePf = admin?.profile_picture.arrayValue.values.filter(
    (d) => d.mapValue.fields.isActive.booleanValue === true
  )[0];


  const dispatch = useDispatch()


  const imgUrl = async () => {
    const urls = await getDownloadURL(ref(storage, storyImgs));
    dispatch(addAdminProfile(urls))
  };


  const storageRef = ref(
    storage,
    `user_photo/${admin.UID?.stringValue}/${userActivePf?.mapValue.fields.PFID?.stringValue}`
  );

  useEffect(() => {
    // for (let i = 0; i < admin.length; i++) {
      

       const list =    async  () => {
        const not = await listAll(storageRef)

        console.log('not');
        for (let ii = 0; ii < not?.items.length; ii++) {
          setStoryImgs(not.items[ii]?.fullPath);

        }
      };
      console.log(storyImgs);

      list()
      
    // }
    imgUrl();
  }, []);

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

  if(data[0]?._document) return (
    <div
      style={{
        translate: -translateX,
      }}
      className="  tracking-wider flex min-w-[140.6px] h-full bg-[#242526] rounded-md "
    >
      <div className=" relative bg-[#242526] flex flex-col justify-between items-start w-full h-full rounded-md ">
        <div className="h-[100%] bg-[#242526] absolute flex gap-1 justify-start items-center  bg-center object-center    object-cover rounded-md ">
          
              <>
              {
                data[0]._document.data.value.mapValue.fields.img_src.stringValue.length > 0 && <img
                className=" cursor-pointer hover:brightness-75 brightness-95 hover:size-[102%] h-[100%]  bg-center object-center    object-cover rounded-md "
                src={data[0]._document.data.value.mapValue.fields.img_src.stringValue}
                alt="story_picture"
                srcSet=""
              />
              }
              {
                data[0]._document.data.value.mapValue.fields.vid_src.stringValue.length > 0 &&  <video
                className=" rounded-md cursor-pointer "
                ref={videoRef}
                src={data[0]._document.data.value.mapValue.fields.vid_src.stringValue}
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
               
               
              </>
             

      

        </div>

        <div className=" z-[9] p-2  w-full h-[50px] flex justify-start items-start  ">
          <div className=" cursor-pointer  flex rounded-full w-[40px] h-[40px] p-[3px] bg-[#0866ff] ">
            <img
              className=" z-[99] rounded-full object-cover w-full h-full "
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
