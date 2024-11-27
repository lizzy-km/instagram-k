import { getDownloadURL, listAll, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { firestore, storage } from "../../firebase/firebase";
import Icon from "@mdi/react";
import { mdiDotsVertical, mdiTrashCanOutline, mdiWindowClose } from "@mdi/js";
import { deleteField, doc, updateDoc } from "firebase/firestore";
import { setViewStory } from "../../redux/services/animateSlice";
import { setStoryId, setUpdateFeed } from "../../redux/services/authSlice";

const ViewStoryCard = ({ userData }) => {
  const { storyId, admin, userAvatar, changesSTID } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const data = userData?.filter((d) =>
    d?._document.data.value.mapValue.fields?.story.arrayValue.values?.length
      ? d?._document.data.value.mapValue.fields?.story?.arrayValue?.values[0]
          ?.mapValue.fields.STID?.stringValue === storyId
      : false
  )[0]?._document.data.value.mapValue.fields;

  const UID = data?.UID.stringValue;
  const STID =
    data?.story?.arrayValue.values[0]?.mapValue.fields?.STID?.stringValue;
  const UserName = data?.user_name?.stringValue;

  const PFURL =
    data?.profile?.arrayValue.values[0]?.mapValue.fields?.PFPATH?.stringValue;

  useEffect(() => {
    storyId?.length > 0 && setStoryD("");
  }, [storyId, changesSTID]);

  useEffect(() => {
    storyId?.length > 0 && setStoryD("");
  }, []);

  const [storySrc, setStorySrc] = useState();
  const [storyD, setStoryD] = useState();

  const storyUrl = async () => {
    const urls = await getDownloadURL(ref(storage, storySrc));
    setStoryD(urls);
  };

  const storyeRef = ref(storage, `user_story/${UID}/${STID}`);

  const storyList = async () => {
    const not = await listAll(storyeRef);

    for (let ii = 0; ii < not?.items.length; ii++) {
      setStorySrc(not.items[ii]?.fullPath);
    }
  };

  useEffect(() => {
    storyList();
  }, [storyId]);

  useEffect(() => {
    storyUrl();
  }, [storySrc]);

  const [menu, setMenu] = useState(false);

  const deleteStory = async () => {
    setMenu(false);

    const storyRef = doc(firestore, "users", `${UID}`);

    await updateDoc(storyRef, {
      story: deleteField(),
    })
      .then(
        async (data) =>
          await updateDoc(storyRef, {
            story: [
              {
                isImage: false,
              },
            ],
          }).then(() => dispatch(setUpdateFeed(+1)))
      )
      .catch((error) => console.log(error));
  };

  const dispatch = useDispatch();
  const { isTablet, isMobile, isDeskTop } = useSelector(
    (state) => state.animateSlice
  );

  return (
    <div
      style={{
        width: isDeskTop ? "70%" : "100%",
      }}
      className="  z-[9999] h-full relative  rounded-md flex justify-start items-start "
    >
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

      {storyD && (
        <img
          className=" absolute cursor-pointer w-full h-full object-cover rounded-md "
          src={storyD}
          alt=""
          srcset=""
        />
      )}
    </div>
  );
};

export default ViewStoryCard;
