import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { firestore, storage } from "../../firebase/firebase";
import Icon from "@mdi/react";
import { mdiDotsVertical, mdiTrashCanOutline, mdiWindowClose } from "@mdi/js";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { setViewStory } from "../../redux/services/animateSlice";
import {
  addAdmin,
  setStoryId,
  setUpdateFeed,
} from "../../redux/services/authSlice";
import GetAdminData from "../../redux/services/Hooks/GetAdminData";
import { Carousel } from "flowbite-react";
import ImageCard from "./ImageCard";
import StoryImageCard from "./StoryImageCard";

const ViewStoryCard = ({ userData }) => {
  const { storyId, admin, userAvatar, changesSTID, updateFeed } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const UID = localStorage.getItem("STOID");

  console.log(UID);

  const STID = "";

  const UserName = "";

  const data = userData?.filter((d) =>
    d?._document?.data?.value.mapValue.fields
      ? d?._document.data.value.mapValue.fields?.UID?.stringValue === UID
      : false
  )[0]?._document.data.value.mapValue.fields;

  // const [storyData, setStoryData] = useState([]);
  const [USER_STORYS, setUSER_STORYS] = useState([]);

  const Story = USER_STORYS?.filter(
    (d) =>
      d._document.data.value.mapValue.fields.STORY_OWNER_DETAIL?.mapValue.fields
        .STOID?.stringValue !== admin.UID.stringValue
  );

  const UserStory = USER_STORYS?.filter(
    (d) =>
      d._document.data.value.mapValue.fields.STORY_OWNER_DETAIL?.mapValue.fields
        .STOID?.stringValue === UID
  );

  const PFURL =
    data?.profile?.arrayValue.values[0]?.mapValue.fields?.PFPATH?.stringValue;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function USER_STORYS() {
      setIsLoading(true);

      await getDocs(collection(firestore, "/USER_STORYS"))
        .then((data) => {
          setUSER_STORYS(data?.docs);
        })
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));
    }
    USER_STORYS();
  }, [changesSTID, updateFeed]);

  useEffect(() => {
    async function USER_STORYS() {
      setIsLoading(true);

      await getDocs(collection(firestore, "/USER_STORYS"))
        .then((data) => {
          setUSER_STORYS(data?.docs);
        })
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));
    }
    USER_STORYS();
  }, []);

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
            dispatch(setStoryId());
            !isDeskTop && dispatch(setViewStory(false));
          })
          .catch((error) => console.log(error))
      )
      .catch((error) => console.log(error));
  };

  const dispatch = useDispatch();
  const { isMobile, isDeskTop } = useSelector((state) => state.animateSlice);

  const Stdata = UserStory[0]?._document.data.value.mapValue.fields;
  const SOD = Stdata?.STORY_OWNER_DETAIL?.mapValue.fields;
  const SD = Stdata?.STORY_DETAIL?.mapValue.fields;
  const img_url =
    SD?.STORY_IMAGE_PATH?.mapValue.fields?.downloadURL?.stringValue;
  const STIDd = Stdata?.id;


  return (
    <div
      style={{
        width: isDeskTop ? "70%" : "100%",
      }}
      className="  z-[9999] h-full relative  rounded-md flex justify-start items-start "
    >
      {storyId?.length > 10 && (
        <>
          <div
            className={` z-[99] relative rounded-t-md backdrop-brightness-[80px] bg-[#21212145] backdrop-blur p-2   flex w-[100%]  gap-3 `}
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
            <div className=" absolute cursor-pointer  w-full h-full object-cover rounded-lg ">
              {UserStory?.length > 1 ? (
                <Carousel loop={false} slideInterval={0} slide={false}>
                  {UserStory?.map((ust) => {
                    const data = ust?._document.data.value.mapValue.fields;
                    const SOD = data?.STORY_OWNER_DETAIL?.mapValue.fields;
                    const SD = data?.STORY_DETAIL?.mapValue.fields;
                    const img_url =
                      SD?.STORY_IMAGE_PATH?.mapValue.fields?.downloadURL
                        ?.stringValue;
                    const STID = ust?.id;

                    return (
                      <StoryImageCard PID={STID} key={STID} url={img_url} />
                    );
                  })}
                </Carousel>
              ) : (
                <StoryImageCard PID={STIDd} key={STIDd} url={img_url} />
              )}
            </div>
          ) : (
            <div className=" absolute cursor-pointer bg-[#24242490] w-full h-full object-cover rounded-lg "></div>
          )}
        </>
      )}
    </div>
  );
};

export default ViewStoryCard;
