import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChangesSTID, setStoryId } from "../../redux/services/authSlice";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { storage } from "../../firebase/firebase";

const UserCard = ({ data }) => {
  const dispatch = useDispatch();
  


  const UID = data?.UID.stringValue;
  const STID =  data?.story?.arrayValue?.values ? 
    data?.story?.arrayValue?.values[0]?.mapValue.fields?.STID?.stringValue : []
  const UserName = data.user_name.stringValue;
  const PFID = data?.profile?.arrayValue.values[0]?.mapValue.fields.PFID.stringValue
  const PFURL = data?.profile?.arrayValue.values[0]?.mapValue.fields?.PFPATH?.stringValue

  const { storyId, userId,userAvatar,changesSTID } = useSelector((deserializedState) => deserializedState.authSlice);



  return (
    <div
      onClick={() => {
        dispatch(setStoryId(STID))
        dispatch(setChangesSTID(!changesSTID))
    }  }
      className={` bg-[${
        storyId === STID ? "#333333" : "#262626"
      }] rounded-md hover:bg-[#333333] cursor-pointer flex w-[300px]  gap-3 p-2 `}
    >
        <div className=" flex justify-center items-center p-1 rounded-full bg-[#212121] " >
            <img className=" w-[45px] h-[45px] rounded-full object-cover object-center " src={PFURL?.length > 4 ? PFURL : userAvatar} alt="" srcset="" />
        </div>

        <div className=" flex py-1 justify-start items-center " >
                <p className=" p-1 text-center w-full h-full " > {UserName} </p>
        </div>
    </div>
  );
};

export default UserCard;
