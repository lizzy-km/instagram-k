import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GetAdminData from "../redux/services/Hooks/GetAdminData";
import { useDispatch, useSelector } from "react-redux";
import {
  addAdmin,
  addUserData,
  setHasNewStory,
} from "../redux/services/authSlice";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const Loading = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getAdmin = [GetAdminData()];
  const { admin, hasNewStory } = useSelector((state) => state.authSlice);

  const getData = async () => {
    const data = await getDocs(collection(firestore, "users"));

    const doc = data.docs;

    let u = [];

    for (let i = 0; i < doc?.length; i++) {
      const User = await getDocs(collection(firestore, "users"));

      u.push(User.docs[i]);
    }
    dispatch(addUserData(u));

    return u;
  };

  useEffect(() => {
    getData();
    Promise.all(getAdmin)
      .then((data) => {
        dispatch(addAdmin(data[0]));
        navigate("/");
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    dispatch(setHasNewStory(!hasNewStory));
  }, []);

  return <div className=" w-full h-screen "></div>;
};

export default Loading;
