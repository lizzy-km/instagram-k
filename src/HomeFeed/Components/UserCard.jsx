import { useDispatch, useSelector } from "react-redux";
import { setChangesSTID, setStoryId } from "../../redux/services/authSlice";

const UserCard = ({ data, STID ,UID,className=''}) => {
  const dispatch = useDispatch();

  const UserName = data?.user_name?.stringValue;
  const PFURL =
    data?.profile?.arrayValue.values[0]?.mapValue.fields?.PFPATH?.stringValue;

  const { storyId, userAvatar, changesSTID } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  return (
    <div
      onClick={() => {
        dispatch(setStoryId(UID));
        dispatch(setChangesSTID(!changesSTID))
      }}
      className={` ${className} bg-[${
        storyId === UID ? "#333333" : "#181818"
      }] rounded-md hover:bg-[#333333] cursor-pointer flex w-[300px]  gap-3 p-2 `}
    >
      <div className=" flex justify-center items-center p-1 rounded-full bg-[#212121] ">
        <img
          className=" w-[45px] invert-none h-[45px] rounded-full object-cover object-center "
          src={PFURL?.length > 4 ? PFURL : userAvatar}
          alt=""
          srcset=""
        />
      </div>

      <div className=" flex py-1 justify-start items-center ">
        <p className=" p-1 text-center w-full h-full "> {UserName} </p>
      </div>
    </div>
  );
};

export default UserCard;
