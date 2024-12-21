import React from "react";
import { useDispatch, useSelector } from "react-redux";
import UserCard from "../HomeFeed/Components/UserCard";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { chatOn, messengerOn, setBottomNav } from "../redux/services/animateSlice";

const MessageCard = () => {
  const { UserData, updateFeed } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );
  const { isTablet, isMobile, isDeskTop } = useSelector(
    (deserializedState) => deserializedState.animateSlice
  );
  const { account, noti, messenger, showChat } = useSelector(
    (state) => state.animateSlice
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const Admin = auth.currentUser;

  const uniqueArray = UserData?.filter((dat) => dat?.id !== Admin?.uid);


  const goChat = (UID) => {

    localStorage.setItem("targetId", UID);
    isMobile && navigate(`/message/${UID}`);

    isMobile &&  dispatch(
      messengerOn({
        messenger: !messenger,
      })

    );

    !isMobile && dispatch(chatOn(true))

    dispatch(setBottomNav(false));

  };

  return (
    <div className=" flex flex-col w-full gap-2  justify-start items-start ">
      {uniqueArray?.map((d) => {
        const data = d?._document?.data?.value.mapValue.fields;
        const UID = d.id;

        return (
          <div
            className={`${isMobile ? 'w-[90%]':'w-full' } h-auto p-1`}
            onClick={() => goChat(UID)}
            key={d?._document?.data?.value.mapValue.fields.UID.stringValue}
          >
            <UserCard
              className={"   w-full "}
              STID={"0"}
              data={d?._document?.data?.value.mapValue.fields}
              key={d?._document?.data?.value.mapValue.fields.UID.stringValue}
              UID={d?._document?.data?.value.mapValue.fields.UID?.stringValue}
              isMessage={true}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MessageCard;
