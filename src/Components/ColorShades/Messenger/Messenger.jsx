import React, { useEffect, useRef, useState } from "react";

import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, firestore } from "../../../firebase/firebase";
import { addDoc, collection,  orderBy, query } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import Icon from "@mdi/react";
import {
 
  mdiSendVariantOutline,
} from "@mdi/js";
import { chatOn } from "../../../redux/services/animateSlice";

const Messenger = () => {
  const dummy = useRef();

  const targetId = localStorage.getItem("targetId");

  const dispatch = useDispatch();

  const { adminProfile } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const messagesRf = collection(firestore, "MESSAGES");
  const quer = query(messagesRf, orderBy("createdAt"));
  const inputRef = useRef("");

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

  const [text, setText] = useState(""); // Input text
  const [showPicker, setShowPicker] = useState(false); // Emoji picker visibility

  // Handle emoji selection
  const onEmojiClick = (emojiObject) => {
    setText((prevText) => prevText + emojiObject.emoji);
    setShowPicker(false); // Hide the picker after selection
  };

  return (
    <section className=" flex flex-col gap-4  h-full overflow-scroll p-1 justify-start items-start w-full ">
      <div
        onClick={() => dispatch(chatOn(false))}
        className=" flex p-2 cursor-pointer tracking-wide text-2xl "
      >
        Close
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
