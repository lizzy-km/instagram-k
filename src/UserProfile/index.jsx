import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import CreatePost from "../HomeFeed/Components/CreatePost";
import firebase from "firebase/compat/app";
import { app, storage } from "../firebase/firebase";

const UserProfile = () => {
  const { admin, adminProfile, UserData } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const { isTablet, isMobile, isDeskTop } = useSelector(
    (state) => state.animateSlice
  );

  useEffect(()=> {
    const storageRefr = '-'
    console.log(storageRefr);

  },[])

  return (
    <section className=" flex flex-col relative top-0  bg-[#121212] w-full   h-screen max-h-screen overflow-y-auto overflow-x-hidden ">

        <section className=" h-[78%] w-full absolute bg-[#242526]  ">
          
        </section>

        <section className="w-full p-3 absolute top-[78%] items-center  justify-center  flex gap-2  ">
          <div className=" w-[60%]  flex gap-2  ">
            <div className=" w-[40%] h-[500px] bg-[#242526] rounded-md "></div>

            <div className=" w-[60%] h-[800px]   justify-center items-center rounded-md ">
             <CreatePost/>
            </div>
          </div>
        </section>
    </section>
  );
};

export default UserProfile;
