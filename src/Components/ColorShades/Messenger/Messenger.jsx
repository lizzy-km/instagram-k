import React, { useState } from "react";

import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth, firestore } from "../../../firebase/firebase";
import { addDoc, collection, limit, orderBy, query } from "firebase/firestore";
import { useSelector } from "react-redux";
import Icon from "@mdi/react";
import {
  mdiMessageArrowRight,
  mdiPhoneMessageOutline,
  mdiSendVariant,
  mdiSendVariantOutline,
} from "@mdi/js";

const Messenger = () => {
  const { adminProfile, isSearch } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const messagesRf = collection(firestore, "MESSAGES");
  const quer = query(messagesRf, orderBy("createdAt"), limit(25));

  const [messages] = useCollectionData(quer, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const d = auth.currentUser;

  console.log(d);

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
  };

  const [text, setText] = useState(""); // Input text
  const [showPicker, setShowPicker] = useState(false); // Emoji picker visibility

  // Handle emoji selection
  const onEmojiClick = (emojiObject) => {
    setText((prevText) => prevText + emojiObject.emoji);
    setShowPicker(false); // Hide the picker after selection
  };

  return (
    <section className=" flex flex-col gap-4 p-1 justify-end items-end w-full ">
      <main className=" flex w-full flex-col justify-end items-end gap-2 ">
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span></span>
      </main>

      <form
        className=" flex bg-[#181818] rounded-lg justify-between w-full p-2 items-center "
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
          className=" py-1 px-2 tracking-wide w-auto rounded-md bg-[#212121] "
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder=" Message"
        />

        <button type="submit" disabled={!formValue}>
          <Icon path={mdiSendVariantOutline} size={1.3} />
        </button>
      </form>
    </section>
  );
};

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

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
          src={
            photoURL || "https://api.adorable.io/avatars/23/abott@adorable.png"
          }
        />
        <p className=" tracking-wide text-sm font-sans px-2 py-1 bg-[#333333] rounded-lg ">
          {text}
        </p>
      </div>
    </section>
  );
}

export default Messenger;
