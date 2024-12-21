import React, { useEffect, useRef, useState } from "react";

import { useCollectionData } from "react-firebase-hooks/firestore";
import { addDoc, collection, limit, orderBy, query } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import Icon from "@mdi/react";
import {
  mdiMessageArrowRight,
  mdiPhoneMessageOutline,
  mdiSendVariant,
  mdiSendVariantOutline,
} from "@mdi/js";
import { auth, firestore } from "../firebase/firebase";
import { setBottomNav } from "../redux/services/animateSlice";

const MessengerApp = () => {
  const { adminProfile, isSearch, userAvatar } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );
  const dummy = useRef();

  const messagesRf = collection(firestore, "MESSAGES");
  const quer = query(messagesRf, orderBy("createdAt"), limit(25));

  const [messages] = useCollectionData(quer, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid } = auth.currentUser;

    formValue?.length > 0 &&
      (await addDoc(messagesRf, {
        text: formValue,
        createdAt: Date.now(),
        uid,
        photoURL: adminProfile,
      }));

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  let view = document.getElementById("spn");
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setBottomNav(false));

    if (view) {
      view?.scrollIntoView();
    }
    view = dummy.current;
  }, []);

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
    <section className=" relative w-full flex h-screen    ">

      <main className=" h-[80%] relative max-h-[80%] overflow-scroll mt-[20%]  w-full flex-col flex  ">
        <div className={"flex flex-col absolute w-full h-auto top-0    "} >
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span id="spn" className="w-full h-1 p-1 " ref={dummy}></span>
        </div>
       
      
      </main>

      <form
        className=" fixed bottom-4 flex bg-[#181818] h-auto rounded-lg justify-between w-full p-2 items-center "
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

      {/* {isMobile && <div className=" flex h-[80px] w-full "></div>} */}
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
      } " flex w-full my-2   gap-2 "`}
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
