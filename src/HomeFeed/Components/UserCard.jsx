import { useDispatch, useSelector } from "react-redux";
import { setChangesSTID, setStoryId } from "../../redux/services/authSlice";
import { collection, orderBy, query } from "firebase/firestore";
import { auth, firestore } from "../../firebase/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";

const UserCard = ({
  data,
  STID,
  UID = "",
  className = "",
  isMessage = false,
}) => {
  const dispatch = useDispatch();

  const targetId = UID;

  const UserName = data?.user_name?.stringValue;
  const PFURL =
    data?.profile?.arrayValue.values[0]?.mapValue.fields?.PFPATH?.stringValue;

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
    )?.sort((a, b) => a?.createdAt - b?.createdAt)

  const text  = targetMessage?.length > 0 && targetMessage[targetMessage?.length -1]?.text

  const myMsg =targetMessage?.length > 0 && targetMessage[targetMessage?.length -1]?.uid === uid

  

  const imageSize = isMessage ? ' w-[40px] h-[40px] ': ' w-[45px] h-[45px] '

  return (
    <div
      onClick={() => {
        dispatch(setStoryId(UID));
        dispatch(setChangesSTID(!changesSTID));
      }}
      className={` ${className} bg-[${
        storyId === UID ? "#232425" : "#181818"
      }] rounded-md hover:bg-[#232425] border border-[#333333] cursor-pointer flex w-[300px]  gap-3 p-2 `}
    >
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
        {isMessage && text && <p className=" text-sm  bg-[#33333357] px-2 rounded py-1  opacity-75 font-medium tracking-wide  "> {myMsg && "You: "} {text}</p>}
      </div>
    </div>
  );
};

export default UserCard;
