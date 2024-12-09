import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setViewStory } from "../../redux/services/animateSlice";
import { setChangesSTID, setStoryId } from "../../redux/services/authSlice";
import { NavLink } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";

const OtherStoryCard = ({ data, translateX }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [USER_STORYS, setUSER_STORYS] = useState([]);

  const videoRef = useRef(null);

  const { userAvatar, changesSTID, UserData, updateFeed, admin } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const Story = USER_STORYS?.filter(
    (d) =>
      d._document.data.value.mapValue.fields.STORY_OWNER_DETAIL?.mapValue.fields
        .STOID?.stringValue !== admin.UID.stringValue
  );

  const UserStory = Story?.filter(
    (d) =>
      d._document.data.value.mapValue.fields.STORY_OWNER_DETAIL?.mapValue.fields
        .STOID?.stringValue === data?.id
  );

  const UID = data?.id;
  const name =
    data?._document.data.value.mapValue.fields?.user_name.stringValue;

  const user = UserData?.filter((usd) => {
    const STOID = UID;

    return usd.id === STOID;
  })[0]?._document.data.value.mapValue.fields;

  const userPfData =
    user?.profile?.arrayValue.values[0]?.mapValue.fields?.PFPATH?.stringValue;

  const dispatch = useDispatch();

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function USER_STORY() {
      setIsLoading(true);

      await getDocs(collection(firestore, "/USER_STORYS"))
        .then((data) => {
          setUSER_STORYS(data?.docs);
        })
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));
    }
    USER_STORY();
  }, []);
  useEffect(() => {
    async function USER_STORY() {
      setIsLoading(true);

      await getDocs(collection(firestore, "/USER_STORYS"))
        .then((data) => {
          setUSER_STORYS(data?.docs);
        })
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));
    }
    USER_STORY();
  }, [updateFeed]);

  useEffect(() => {
    if (isPlaying) {
      videoRef.current.play();
    }
  }, [isPlaying]);

  const [userProfile, setUserProfile] = useState();

  if (UserStory?.length > 0)
    return (
      <div
        style={{
          translate: -translateX,
        }}
        className=" transition-all tracking-wider flex min-w-[145px] h-full bg-[#525252] rounded-md "
      >
        <div className=" relative flex flex-col justify-between items-start w-full h-full rounded-md ">
          {UserStory?.map((ust) => {
            const data = ust?._document.data.value.mapValue.fields;
            const SOD = data?.STORY_OWNER_DETAIL?.mapValue.fields;
            const SD = data?.STORY_DETAIL?.mapValue.fields;
            const img_url =
              SD?.STORY_IMAGE_PATH?.mapValue.fields?.downloadURL?.stringValue;
            const STID = ust?.id;

            return (
              <div
                onClick={() => {
                  dispatch(setViewStory(true)),
                    dispatch(setStoryId(UID)),
                    dispatch(setChangesSTID(!changesSTID));

                }}
                className="h-[100%] absolute  bg-center object-center  w-full   object-cover rounded-md "
              >
                {img_url && (
                  <img
                    className=" invert-none transition-all  cursor-pointer hover:brightness-75 brightness-95 hover:size-[102%] w-[100%] h-[100%]  bg-center object-center    object-cover rounded-md "
                    src={img_url?.length > 0 ? img_url : userAvatar}
                    alt="story_picture"
                    srcSet=""
                  />
                )}
                {img_url && (
                  <video
                    className=" invert-none rounded-md cursor-pointer "
                    ref={videoRef}
                    src={img_url}
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
            );
          })}

          <div className=" z-[9] p-2  w-full h-[50px] flex justify-start items-start  ">
            <NavLink
              to={`/${UID}`}
              onClick={() => localStorage.setItem("userProfile", userProfile)}
              className=" cursor-pointer  flex rounded-full w-[40px] h-[40px] p-[3px] bg-[#CA3E47] "
            >
              {user?.profile_picture?.arrayValue.values.map((d) => {
                return (
                  <>
                    {d.mapValue.fields.isActive.booleanValue === true ? (
                      <img
                        key={d.mapValue.fields.PFID.stringValue}
                        className=" invert-none z-[99] rounded-full object-cover w-full h-full "
                        src={userPfData?.length > 0 ? userPfData : userAvatar}
                        alt=""
                        srcSet=""
                      />
                    ) : null}
                  </>
                );
              })}
            </NavLink>
          </div>

          <div className=" rounded-b-md relative z-[9] w-full p-0 ">
            <div className="  bg-img rounded-b-md    text-[#d1d1d1] font-[450]  ">
              <p className=" p-2 flex w-full h-full backdrop-shadow ">{name}</p>
            </div>
          </div>
        </div>
      </div>
    );
};

export default OtherStoryCard;
