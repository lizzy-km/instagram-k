import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { imageList, setImageList } from "../authSlice";
const DataCard = ({ data }) => {
  const dispatch = useDispatch();
  const { userAvatar, UserData, admin, hasNewStory, updateFeed,imageList } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const PIP_Length =
    data?.POST_DETAIL?.mapValue.fields.POST_IMAGE_PATH.arrayValue.values;
  const POD = data?.POST_OWNER_DETAIL?.mapValue.fields;

  const url =
    PIP_Length[PIP_Length?.length - 1]?.mapValue.fields.downloadURL
      ?.stringValue;
  const UID = POD?.POID?.stringValue;

  const userProfileById = UserData?.filter((ud) => ud?.id === UID)[0]?._document
    ?.data.value.mapValue.fields?.profile?.arrayValue.values[0]?.mapValue.fields
    ?.PFPATH?.stringValue;

  const name = POD?.PON?.stringValue;

  const isExist = imageList?.findIndex((img) => img?.url === url) > 0

  console.log("isExist", isExist);

  useEffect(() => {

    userProfileById?.length > 10 && !isExist &&  dispatch(
      setImageList({url: url, userProfile: userProfileById, name: name})
    );
    // console.log(userProfileById);
    
  }, [userProfileById]);

  // console.log("DataCard Rendered",imageList);

  return;
};

export default DataCard;
