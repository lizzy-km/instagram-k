import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addStory, setStoryId } from "../../redux/services/authSlice";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { setViewStory } from "../../redux/services/animateSlice";
import UserCard from "./UserCard";
import { mdiWindowClose } from "@mdi/js";
import Icon from "@mdi/react";
import ViewStoryCard from "./ViewStoryCard";

const ViewStory = () => {
  const { UserData } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );
  const dispatch = useDispatch();

  const userData = UserData;

  

  const user = userData?.filter((d) =>
    d?._document.data.value.mapValue.fields?.story?.arrayValue.values?.length >
    0
      ? d?._document.data.value.mapValue.fields.story?.arrayValue?.values[0]
          ?.mapValue.fields.STID?.stringValue?.length > 0
      : false
  );



  const { isMobile, isDeskTop } = useSelector((state) => state.animateSlice);
  return (
    <div
      className={` flex justify-start items-center ${
        isDeskTop && "p-2"
      } w-full h-full `}
    >
      {isDeskTop && (
        <div className="  justify-start items-start h-full flex flex-col gap-2 ">
          <div className=" w-full h-[65px] flex justify-between p-2 items-center ">
            <div
              onClick={() => {
                dispatch(setViewStory(false)), dispatch(setStoryId(0));
              }}
              className=" cursor-pointer bg-[#333333] rounded-full p-1 "
            >
              <Icon path={mdiWindowClose} size={1} />
            </div>

            <p className=" text-2xl font-medium tracking-wider ">Stories</p>
          </div>

          {!isMobile && (
            <div className=" w-[100%] h-auto flex flex-col gap-2 ">
              {user?.map((d) => {
                return (
                  <UserCard
                    data={d?._document.data.value.mapValue.fields}
                    key={d._document.data.value.mapValue.fields.UID.stringValue}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      <div
        style={{
          width: isDeskTop ? "50%" : "100%",
          padding: isDeskTop ? "1rem" : 0,
        }}
        className=" flex justify-center items-center  h-full p-0  backdrop-brightness-50 backdrop-blur "
      >
        <ViewStoryCard userData={user} />
      </div>
    </div>
  );
};

export default ViewStory;
