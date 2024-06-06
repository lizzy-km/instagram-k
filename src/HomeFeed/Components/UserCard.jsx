import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStoryId } from "../../redux/services/authSlice";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { storage } from "../../firebase/firebase";

const UserCard = ({ data }) => {
  const dispatch = useDispatch();

  const UID = data?.UID.stringValue;
  const STID =  data?.story?.arrayValue?.values ? 
    data?.story?.arrayValue?.values[0]?.mapValue.fields?.STID?.stringValue : []
  const UserName = data.user_name.stringValue;
  const PFID = data?.profile_picture.arrayValue.values[0]?.mapValue.fields.PFID.stringValue

  const { storyId, userId } = useSelector((deserializedState) => deserializedState.authSlice);

  const [imgPath,setImgPath] = useState("")
  const [profileUrl,setProfileUrl] = useState()

//   Get User Profile Image Url From Firebase Storage 
const imgUrl = async () => {
    const urls = await getDownloadURL(ref(storage, imgPath));
    setProfileUrl(urls);
  };

  const storageRef = ref(
    storage,
    `user_photo/${UID}/${PFID}`
  );

  const list = async () => {
    const not = await listAll(storageRef);

    for (let ii = 0; ii < not?.items.length; ii++) {
        setImgPath(not.items[ii]?.fullPath);
    }
  };

  useEffect(() => {
    list();
  }, []);

  useEffect(() => {
    imgUrl();
  }, [imgPath]);

  return (
    <div
      onClick={() => dispatch(setStoryId(STID))}
      className={` bg-[${
        storyId === STID ? "#333333" : "#262626"
      }] rounded-md hover:bg-[#333333] cursor-pointer flex w-[300px]  gap-3 p-2 `}
    >
        <div className=" flex justify-center items-center p-1 rounded-full bg-[#212121] " >
            <img className=" w-[45px] h-[45px] rounded-full object-cover object-center " src={profileUrl} alt="" srcset="" />
        </div>

        <div className=" flex py-1 justify-start items-center " >
                <p className=" p-1 text-center w-full h-full " > {UserName} </p>
        </div>
    </div>
  );
};

export default UserCard;
