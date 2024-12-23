import React, { useEffect, useRef, useState } from "react";

import {
  useCollectionData,
  useCollectionDataOnce,
} from "react-firebase-hooks/firestore";
import { auth, firestore } from "../../../firebase/firebase";
import { addDoc, collection, orderBy, query, where } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import Icon from "@mdi/react";
import {
  mdiCloseOutline,
  mdiSendVariantOutline,
  mdiWindowClose,
} from "@mdi/js";
import { chatOn } from "../../../redux/services/animateSlice";
import UserCard from "../../../HomeFeed/Components/UserCard";
import { Link, NavLink } from "react-router-dom";

const Messenger = () => {
  const dummy = useRef();

  const targetId = localStorage.getItem("targetId");

  const dispatch = useDispatch();
  const inputRef = useRef("");

  const { adminProfile } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const messagesRf = collection(firestore, "MESSAGES");
  const quer = query(messagesRf, orderBy("createdAt"));

  const userRf = collection(firestore, "users");
  const userQuery = query(userRf, where("UID", "==", targetId));
  const [TUser] = useCollectionDataOnce(userQuery, { idField: "id" });

  const [messages] = useCollectionData(quer, { idField: "id" });
  const { uid } = auth.currentUser;

  const targetMessage = messages
    ?.filter(
      (msg) => msg?.mid === targetId + uid || msg?.mid === uid + targetId
    )
    .sort((a, b) => a.createdAt - b.createdAt);

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid } = auth.currentUser;

    await addDoc(messagesRf, {
      text: inputRef.current?.value,
      createdAt: Date.now(),
      uid,
      photoURL: adminProfile,
      target: targetId,
      mid: uid + targetId,
      images: [""],
    });

    inputRef.current.value = "";
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, targetMessage]);

  return (
    <section className=" flex flex-col gap-4  h-full overflow-scroll bg-[#181818]   rounded justify-start items-start w-full ">
      <div className=" bg-[#333333] rounded-t flex justify-between items-center w-full  ">
       
        <UserCard
            className={" border-none rounded-none   w-[80%] "}
            href={`${targetId}`}

            STID={"0"}
            data={TUser ? TUser[0] : []}
            UID={targetId}
            isMessage={false}
            topMsg={true}
          />
        <div
          onClick={() => dispatch(chatOn(false))}
          className=" flex p-2 flex w-[20%] justify-center items-center  cursor-pointer tracking-wide text-2xl "
        >
          <Icon path={mdiWindowClose} size={1} />
        </div>
      </div>

      <main className=" flex w-full flex-col mt-[18%] justify- h-[95%] max-h-[95%] overflow-scroll items-end gap-2 ">
        {targetMessage &&
          targetMessage.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

        <span ref={dummy}></span>
      </main>

      <form
        className=" flex bg-[#181818] h-auto rounded-lg justify-between w-full p-2 items-center "
        onSubmit={sendMessage}
      >
        <input
          className=" py-1 px-2 tracking-wide w-auto rounded-md bg-[#212121] "
          ref={inputRef}
          placeholder=" Message"
        />

        <button type="submit">
          <Icon path={mdiSendVariantOutline} size={1.3} />
        </button>
      </form>
    </section>
  );
};

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const { adminProfile, isSearch, userAvatar } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <section
      className={` ${
        uid === auth.currentUser.uid ? " justify-end " : " justify-start "
      } " flex w-full   gap-2 "`}
    >
      <div
        className={` ${
          uid === auth.currentUser.uid ? " flex-row-reverse " : "  "
        } message flex  justify-end items-end  gap-2 ${messageClass}`}
      >
        <img
          className="invert-none rounded-full object-cover w-[30px] h-[30px] "
          src={photoURL || userAvatar}
        />
        <p className=" invert-none tracking-wide text-sm font-sans px-2 py-1 bg-[#333333] rounded-lg ">
          {text}
        </p>
      </div>
    </section>
  );
}

export default Messenger;
