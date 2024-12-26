import React from "react";
import { useDispatch, useSelector } from "react-redux";
import UserCard from "../HomeFeed/Components/UserCard";
import { auth, firestore } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { chatOn, messengerOn, setBottomNav } from "../redux/services/animateSlice";
import { collection, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

const MessageCard = () => {
 
  const {  isMobile } = useSelector(
    (deserializedState) => deserializedState.animateSlice
  );
  const {  messenger } = useSelector(
    (state) => state.animateSlice
  );
  const Admin = auth.currentUser;

  const userRf = collection(firestore, "users");
  const userQuery = query(userRf,where("UID","!=",Admin?.uid));
  const [TUser] = useCollectionData(userQuery, { idField: "id" });

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const uniqueArray = TUser


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
    <div className=" flex flex-col w-full gap-2 h-full max-h-full overflow-scroll  justify-start items-start ">
      {uniqueArray?.map((d) => {
        const data = d
        const UID = data.UID;

        return (
          <div
            className={`${isMobile ? 'w-[90%]':'w-full' } h-auto p-1`}
            onClick={() => goChat(UID)}
            key={data.UID}
          >
            <UserCard
              className={"   w-full "}
              STID={"0"}
              data={data}
              key={data.UID}
              UID={data.UID}
              isMessage={true}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MessageCard;
