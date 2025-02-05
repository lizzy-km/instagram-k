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
import StoryImageCard from "./StoryImageCard";

const ViewStoryCard = ({ userData }) => {
  const { storyId, admin, userAvatar, changesSTID, updateFeed } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const UID = storyId ? storyId : "";

  const STID = "";

  const data = userData?.filter((d) =>
    d
      ? d.UID === UID
      : false
  )[0];

  const UserName = data?.user_name;

  // const [storyData, setStoryData] = useState([]);
  const [USER_STORYS, setUSER_STORYS] = useState([]);

  const Story = USER_STORYS?.filter(
    (d) =>
      d._document.data.value.mapValue.fields.STORY_OWNER_DETAIL?.mapValue.fields
        .STOID?.stringValue !== admin?.UID?.stringValue
  );

  const UserStory = USER_STORYS?.filter(
    (d) =>
      d._document.data.value.mapValue.fields.STORY_OWNER_DETAIL?.mapValue.fields
        .STOID?.stringValue === UID
  );

  // console.log(UserStory);

  const PFURL =
    data?.profile[0]?.PFPATH;
    

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

  console.log(Stdata?.STID?.stringValue);
  

  return (
    <div
      style={{
        width: isDeskTop ? "400px" : isMobile ? "100%" :'70%',
        height :  isDeskTop ? "98%" : isMobile ? "100%" :'90%',
      }}
      className="   z-[9999] h-full relative  rounded-xl flex justify-start items-start "
    >
      {storyId?.length > 0 && (
        <>
          <div
            className={` z-[99] relative ${!isMobile ? 'rounded-t-2xl ':''}    p-2  bg-[#24242457] backdrop-blur-[10px]  flex  w-[100%]  gap-2 `}
          >
            <div className=" flex gap-2 justify-center w-[40px] p-1 h-[40px] items-center  rounded-full  ">
              <img
                className=" invert-none  w-full  h-full rounded-full object-cover object-center "
                src={PFURL?.length > 4 ? PFURL : userAvatar}
                alt=""
                srcset=""
              />
            </div>

            <div className=" flex py-0 justify-start items-center ">
              <p className=" p-1 text-sm text-center w-full h-full ">
                {" "}
                {UserName}{" "}
              </p>
            </div>
            <div className=" p-2 w-[30%] cursor-pointer gap-3 flex justify-end items-center top-1 absolute right-0 ">
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
            </div>
          </div>

          {!isLoading ? (
            <div className=" absolute cursor-pointer flex justify-center items-center  w-full h-full object-cover rounded-xl ">
              {UserStory?.length > 1 ? (
                <Carousel loop={false} slideInterval={0} slide={false}>
                  {UserStory?.reverse()?.map((ust) => {
                    const data = ust?._document.data.value.mapValue.fields;
                    const SOD = data?.STORY_OWNER_DETAIL?.mapValue.fields;
                    const SD = data?.STORY_DETAIL?.mapValue.fields;
                    const img_url =
                      SD?.STORY_IMAGE_PATH?.mapValue.fields?.downloadURL
                        ?.stringValue;
                    const STID = ust?.id;

                    return (
                      <StoryImageCard
                        menu={menu}
                        AID={admin?.UID?.stringValue}
                        UID={UID}
                        setMenu={setMenu}
                        updateFeed={updateFeed}
                        deleteStory={deleteStory}
                        PID={STID}
                        key={STID}
                        url={img_url}
                      />
                    );
                  })}
                </Carousel>
              ) : (
                <StoryImageCard
                menu={menu}
                AID={admin?.UID?.stringValue}
                UID={UID}
                setMenu={setMenu}
                updateFeed={updateFeed}
                deleteStory={deleteStory}
                PID={Stdata?.STID?.stringValue}
                key={Stdata?.STID?.stringValue}
                url={img_url}
              />
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
