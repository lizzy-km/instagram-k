import { getDownloadURL, listAll, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { storage } from "../../../firebase/firebase";
import { setImageList } from "../authSlice";
const DataCard = ({ name, data }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { userAvatar, UserData, admin, hasNewStory, imageList } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const hasPf = data?.profile_picture?.arrayValue?.values?.length > 0;

  const hasPostD = data?.post?.arrayValue?.values?.length > 0;

  const post = hasPostD ? data?.post?.arrayValue?.values : [];

  return post.map((d) => {

    const [userProfile, setUserProfile] = useState();
    const [storyImgs, setStoryImgs] = useState();
    const [postImgs, setPostImgs] = useState([null]);
    const [postUrl, setPostUrl] = useState([null]);
    const [count, setCount] = useState(0);
    const UID = data.UID.stringValue;

    async function postUrlGen(path) {
      let u =[]
       path?.map(
        async (d) =>
          await getDownloadURL(ref(storage, d.fullPath)).then((data) => {
            u.push(data !== u ? data : null)
            
            dispatch(
              setImageList({
                url: u,
                name: name,
                userProfile: userProfile,
                UID: UID,
              })
            );
          })
      );

      

     
    }

    const imgUrl = async (path) => {
      const urls = await getDownloadURL(ref(storage, path));
      setUserProfile(urls);
    };

    const storageRef = ref(
      storage,
      `user_photo/${data?.UID?.stringValue}/${
        hasPf &&
        data?.profile_picture?.arrayValue?.values[0]?.mapValue?.fields?.PFID
          ?.stringValue
      }`
    );

    const postRef = ref(
      storage,
      `user_post/${data?.UID?.stringValue}/${
        hasPostD && d?.mapValue?.fields?.PID?.stringValue
      }`
    );

    const list = async () => {
      const not = await listAll(storageRef).then((data) => {
        imgUrl(data?.items[0]?.fullPath);
      });
    };

    const postList = async () => {
      await listAll(postRef).then((data) => postUrlGen(data.items));
    };

    useEffect(() => {
      list();
      postList();
    }, []);

  

    return <></>;
  });
};

export default DataCard;
