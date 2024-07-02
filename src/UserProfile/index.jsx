import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import CreatePost from "../HomeFeed/Components/CreatePost";
import firebase from "firebase/compat/app";
import { app, storage } from "../firebase/firebase";
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const { adminProfile,userAvatar,admin,UserData } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const UID = useParams()

  const { isTablet, isMobile, isDeskTop } = useSelector(
    (state) => state.animateSlice
  );

  const user = UserData?.filter(d => d.id=== UID?.user)[0]?._document.data.value.mapValue.fields

  const userProfile = localStorage.getItem('userProfile')


  const bg = 'https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2F328652225_477950631031057_4570664772778110705_n%20(2).jpg?alt=media&token=ada5ce90-591d-47a6-88cb-07e80e9117d7'


  return (
    <section className=" flex flex-col relative top-[-70px]  bg-[#121212] w-full   h-screen max-h-screen overflow-y-auto overflow-x-hidden ">

        <section className=" h-[78%] w-full absolute flex flex-col justify-center items-center bg-[#242526]  ">
          <div className={` absolute w-full h-[70%] top-0 blur-xl opacity-[0.3] brightness-45  `} >
          <img className=" rounded-lg h-full w-full  object-cover " src={bg} alt="" srcset="" />

          </div>

            <div className=" z-[100] relative flex flex-col w-[60%] h-[80%] justify-start items-start   " >
                <img className=" rounded h-[80%] w-full  object-cover " src={bg} alt="" srcset="" />
                <div className=' w-full h-auto absolute bottom-[1%] left-0 flex justify-start items-center ' >

                  <div className=' cursor-pointer p-1 bg-[#333333] rounded-full w-[150px] h-[150px] ' >
                  <img className=" rounded-full h-[100%] w-full  object-cover " src={userProfile?.length > 0? userProfile : userAvatar} alt="" srcset="" />
                  </div>

                  <p className=" px-2 text-[2.2rem] flex w-auto tracking-wide gap-2 font-medium " >
                        {user?.user_name?.stringValue} {
                          user?.nick_name?.stringValue && <p className=" font-thin " >
                              ({user.nick_name?.stringValue})
                          </p>
                        }
                  </p>

                </div>
            </div>
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
