import { getDownloadURL, listAll, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { firestore, storage } from "../../firebase/firebase";
import Icon from "@mdi/react";
import { mdiDotsVertical, mdiTrashCanOutline, mdiWindowClose } from "@mdi/js";
import {
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { setViewStory } from "../../redux/services/animateSlice";
import {
  addAdmin,
  setStoryId,
  setUpdateFeed,
} from "../../redux/services/authSlice";
import GetAdminData from "../../redux/services/Hooks/GetAdminData";

const ViewStoryCard = ({ userData }) => {
  const { storyId, admin, userAvatar, changesSTID, updateFeed } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  console.log(storyId);
  

  const [storyData, setStoryData] = useState([]);

  const StoryDetail = storyData?.STORY_DETAIL?.mapValue.fields;
  const StoryOwnerDetail = storyData?.STORY_OWNER_DETAIL?.mapValue.fields;
  const UID = StoryOwnerDetail?.STOID?.stringValue;

  const img_url =
    StoryDetail?.STORY_IMAGE_PATH?.mapValue.fields.downloadURL?.stringValue;

  const data = userData?.filter((d) =>
    d?._document?.data?.value.mapValue.fields
      ? d?._document.data.value.mapValue.fields?.UID?.stringValue === UID
      : false
  )[0]?._document.data.value.mapValue.fields;

  const STID = storyData?.STID?.stringValue;

  const UserName = StoryOwnerDetail?.STON?.stringValue;

  const PFURL =
    data?.profile?.arrayValue.values[0]?.mapValue.fields?.PFPATH?.stringValue;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getStoryById = async () => {
      setIsLoading(true);
      await getDoc(doc(firestore, "/USER_STORYS", `/${storyId}`))
        .then((data) =>
          setStoryData(data?._document?.data?.value.mapValue.fields)
        )
        .finally(() => setIsLoading(false));
    };

    getStoryById();
  }, []);

  useEffect(() => {
    const getStoryById = async () => {
      setIsLoading(true);
      await getDoc(doc(firestore, "/USER_STORYS", `/${storyId}`))
        .then((data) =>
          setStoryData(data?._document?.data?.value.mapValue.fields)
        )
        .finally(() => setIsLoading(false));
    };

    getStoryById();
  }, [changesSTID, updateFeed]);

  const [menu, setMenu] = useState(false);
  const getAdmin = [GetAdminData()];

  const deleteStory = async () => {
    setMenu(false);
    const storyRef = doc(firestore, "/USER_STORYS", `/${STID}`);

    await deleteDoc(storyRef)
      .then((data) =>
        Promise.all(getAdmin)
          .then((data) => {
            dispatch(addAdmin(data[0]));
            dispatch(setUpdateFeed(!updateFeed));
            dispatch(setStoryId())
            !isDeskTop && dispatch(setViewStory(false));
          })
          .catch((error) => console.log(error))
      )
      .catch((error) => console.log(error));
  };

  const dispatch = useDispatch();
  const { isMobile, isDeskTop } = useSelector((state) => state.animateSlice);

  
  return (
    <div
      style={{
        width: isDeskTop ? "70%" : "100%",
      }}
      className="  z-[9999] h-full relative  rounded-md flex justify-start items-start "
    >{
      storyId?.length > 10 && <>
      <div
        className={` z-[99] relative rounded-t-md backdrop-brightness-[80px] bg-[#21212145] backdrop-blur   flex w-[100%]  gap-3 p-2 `}
      >
        <div className=" flex justify-center items-center p-1 rounded-full bg-[#212121] ">
          <img
            className=" w-[45px] h-[45px] rounded-full object-cover object-center "
            src={PFURL?.length > 4 ? PFURL : userAvatar}
            alt=""
            srcset=""
          />
        </div>

        <div className=" flex py-1 justify-start items-center ">
          <p className=" p-1 text-center w-full h-full "> {UserName} </p>
        </div>
        <div className=" p-2 w-[30%] cursor-pointer gap-3 flex justify-end items-center absolute right-0 ">
          {admin?.UID?.stringValue === UID && (
            <Icon
              onClick={() => setMenu(!menu)}
              className=" cursor-pointer "
              path={mdiDotsVertical}
              size={1}
            />
          )}
          {!isDeskTop && (
            <div
              onClick={() => {
                dispatch(setViewStory(false)), dispatch(setStoryId(0));
              }}
              className=" cursor-pointer  rounded-full p-1 "
            >
              <Icon path={mdiWindowClose} size={1} />
            </div>
          )}

          {admin?.UID?.stringValue === UID && (
            <div
              onClick={deleteStory}
              style={{
                display: menu ? "flex" : "none",
                right: isMobile ? "55%" : "10px",
              }}
              className=" text-sm p-2  w-auto gap-1 flex justify-start items-center top-10 right-[55%] backdrop-blur-sm bg-[#18181859] rounded absolute "
            >
              <Icon path={mdiTrashCanOutline} size={0.6} />
            </div>
          )}
        </div>
      </div>

      {!isLoading ? (
        <img
          className=" absolute cursor-pointer w-full h-full object-cover rounded-md "
          src={img_url}
          alt=""
          srcset=""
        />
      ) : (
        <div className=" absolute cursor-pointer bg-[#24242490] w-full h-full object-cover rounded-lg "></div>
      )}
      </>
    }
      
    </div>
  );
};

export default ViewStoryCard;
