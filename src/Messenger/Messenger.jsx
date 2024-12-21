import React, { useRef, useState } from "react";

import { useCollectionData } from "react-firebase-hooks/firestore";
import { addDoc, collection, limit, orderBy, query } from "firebase/firestore";
import { useSelector } from "react-redux";
import Icon from "@mdi/react";
import {
  mdiMessageArrowRight,
  mdiPhoneMessageOutline,
  mdiSendVariant,
  mdiSendVariantOutline,
} from "@mdi/js";
import { auth, firestore } from "../firebase/firebase";

const MessengerApp = () => {
  const { adminProfile, isSearch, userAvatar } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );
  const dummy = useRef();

  const messagesRf = collection(firestore, "MESSAGES");
  const quer = query(messagesRf, orderBy("createdAt"), limit(25));

  const [messages] = useCollectionData(quer, { idField: "id" });

  

  const [formValue, setFormValue] = useState("");

  const d = auth.currentUser;

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid } = auth.currentUser;

    await addDoc(messagesRf, {
      text: formValue,
      createdAt: Date.now(),
      uid,
      photoURL: adminProfile,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  const [text, setText] = useState(""); // Input text
  const [showPicker, setShowPicker] = useState(false); // Emoji picker visibility

  // Handle emoji selection
  const onEmojiClick = (emojiObject) => {
    setText((prevText) => prevText + emojiObject.emoji);
    setShowPicker(false); // Hide the picker after selection
  };

   const { isTablet, isMobile, isDeskTop } = useSelector(
      (deserializedState) => deserializedState.animateSlice
    );

  return (
    <section className=" flex flex-col gap-4  h-screen overflow-hidden p-1 justify-end items-end w-full ">
      <main className=" flex w-full flex-col mt-[18%] justify- h-[85%] max-h-[85%] overflow-scroll items- gap-2 ">
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form
        className=" flex bg-[#181818] h-auto rounded-lg justify-between w-full p-2 items-center "
        onSubmit={sendMessage}
      >
        {/* Emoji Picker Toggle
         <button
          onClick={() => setShowPicker((prev) => !prev)}
          style={{
            marginLeft: "10px",
            padding: "10px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          😀
        </button>
        {/* Emoji Picker */}
        {/* {showPicker && ( */}
        {/* <div style={{ position: "absolute", top: "50px", zIndex: 100 }}> */}
        {/* <EmojiPicker onEmojiClick={onEmojiClick} /> */}
        {/* </div> */}
        {/* )} */}
        <input
          className=" py-2 px-2 tracking-wide w-full rounded-md bg-[#212121] "
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder=" Message"
        />

        <button type="submit" disabled={!formValue}>
          <Icon path={mdiSendVariantOutline} size={1.3} />
        </button>
      </form>

     {
      isMobile && <div className=" flex h-[80px] w-full "></div>
     } 
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
        <p className=" invert-none tracking-wide text-sm font-sans px-3 py-2 text-center bg-[#333333] rounded-lg ">
          {text}
        </p>
      </div>
    </section>
  );
}

export default MessengerApp;
