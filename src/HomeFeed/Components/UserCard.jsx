import { useDispatch, useSelector } from "react-redux";
import { setChangesSTID, setStoryId } from "../../redux/services/authSlice";
import { collection, orderBy, query } from "firebase/firestore";
import { auth, firestore } from "../../firebase/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Link, useNavigate } from "react-router-dom";

const UserCard = ({
  data,
  STID,
  UID = "",
  className = "",
  isMessage = false,
  topMsg = false,
  href = "",
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const targetId = UID;

  const UserName = data?.user_name;
  const PFURL = data?.profile ? data?.profile[0]?.PFPATH : "";

  const { storyId, userAvatar, changesSTID } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const messagesRf = collection(firestore, "MESSAGES");
  const quer = query(messagesRf, orderBy("createdAt"));

  const [messages] = useCollectionData(quer, { idField: "id" });
  const { uid } = auth.currentUser;

  const targetMessage = messages
    ?.filter(
      (msg) => msg?.mid === targetId + uid || msg?.mid === uid + targetId
    )
    ?.sort((a, b) => a?.createdAt - b?.createdAt);

  const text =
    targetMessage?.length > 0 && targetMessage[targetMessage?.length - 1]?.text;

  const myMsg =
    targetMessage?.length > 0 &&
    targetMessage[targetMessage?.length - 1]?.uid === uid;

  const imageSize = isMessage ? " w-[40px] h-[40px] " : " w-[45px] h-[45px] ";

  const USBody = (
    <>
      <div className=" flex justify-center items-center  h-auto w-auto rounded-full ">
        <img
          className={`${imageSize} invert-none  rounded-full object-cover object-center `}
          src={PFURL?.length > 4 ? PFURL : userAvatar}
          alt=""
          srcset=""
        />
      </div>

      <div className=" flex flex-col gap-1 py- justify-start items-start ">
        <p className=" p- text-start text-base w-full h-full "> {UserName} </p>
        {isMessage && text && (
          <p className=" text-sm  bg-[#33333357] px-2 rounded py-1  opacity-75 font-medium tracking-wide  ">
            {" "}
            {myMsg && "You: "} {text}
          </p>
        )}
      </div>
    </>
  );

  return topMsg ? (
    <Link
      onClick={() => {
        dispatch(setStoryId(UID));
        dispatch(setChangesSTID(!changesSTID));
      }}
      className={` ${className} bg-[${
        storyId === UID ? "#232425" : "#181818"
      }] rounded-md hover:bg-[#232425] border border-[#333333] cursor-pointer flex   gap-3 p-2 `}
    >
      {" "}
      {USBody}{" "}
    </Link>
  ) : (
    <div
      onClick={() => {
        dispatch(setStoryId(UID));
        dispatch(setChangesSTID(!changesSTID));
      }}
      className={` ${className} bg-[${
        storyId === UID ? "#232425" : "#181818"
      }] rounded-md hover:bg-[#232425] border border-[#333333] cursor-pointer flex   gap-3 p-2 `}
    >
      {" "}
      {USBody}{" "}
    </div>
  );
};

export default UserCard;
