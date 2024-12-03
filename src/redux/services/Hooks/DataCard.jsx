import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setImageList } from "../authSlice";
const DataCard = ({ data }) => {
  const dispatch = useDispatch();
  const { userAvatar, UserData, admin, hasNewStory, updateFeed } = useSelector(
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
  useEffect(() => {
    userProfileById?.length > 10 &&  dispatch(
      setImageList({
        url,
        name: name,
        userProfile: userProfileById,
        UID: UID,
      })
    );
    // console.log(userProfileById);
    
  }, [userProfileById]);

  return;
};

export default DataCard;
