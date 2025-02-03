import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  accountSettingOn,
  menuOn,
  messengerOn,
  notiOn,
  setAddProfile,
} from "../redux/services/animateSlice";
import useChangeChildrenVisibility from "./ChangeChildrenVisibility";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { addAdmin, addUserData, setLogin } from "../redux/services/authSlice";
import { collection, getDocs } from "firebase/firestore";
import { auth, firestore } from "../firebase/firebase";
import Cookies from "js-cookie";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import Messenger from "./ColorShades/Messenger/Messenger";
import MessageCard from "./MessageCard";
import UpdateData from "../redux/services/Hooks/UpdateData";
import Noti from "../Noti/Noti";

const RightNav = () => {
  const { account, noti, messenger, menu } = useSelector(
    (state) => state.animateSlice
  );

  const { isTablet, isMobile, isDeskTop, showChat } = useSelector(
    (deserializedState) => deserializedState.animateSlice
  );

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const RIDs = ["account", "noti", "messenger", "menu"];

  useEffect(() => {
    let RNav = null;

    account === true
      ? (RNav = "account")
      : noti === true
      ? (RNav = "noti")
      : messenger === true
      ? (RNav = "messenger")
      : menu === true
      ? (RNav = "menu")
      : (RNav = null);
    for (let index = 0; index < RIDs.length; index++) {
      if (RIDs[index] === RNav) {
        useChangeChildrenVisibility([RIDs[index]], "visible");
      } else {
        useChangeChildrenVisibility([RIDs[index]], "hidden");
      }
    }
  }, [account, noti, messenger, menu]);

  const accountSetting = () => {
    dispatch(
      accountSettingOn({
        account: !account,
      })
    );
  };

  const notification = () => {
    isMobile
      ? navigate("/notification")
      : dispatch(
          notiOn({
            noti: !noti,
          })
        );
  };

  const messengerShow = () => {
    dispatch(
      messengerOn({
        messenger: !messenger,
      })
    );
  };

  const menuShow = () => {
    isMobile
      ? navigate("/menu")
      : dispatch(
          menuOn({
            menu: !menu,
          })
        );
  };

  const { adminProfile, isSearch } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const { admin, userAvatar } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const [isLoading, setIsLoading] = useState(false);

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
    localStorage.getItem("adminId")?.length > 0
      ? null
      : dispatch(setLogin(false));
    getData();
  }, []);

  const fullWidth = window.innerWidth;

  useEffect(() => {}, []);

  return (
    <section
      style={{
        width: isMobile ? "70%" : isTablet ? "35%" : "35%",
        justifyContent: isMobile ? "end" : isTablet ? "end" : "end",
        padding: isMobile ? "0px" : "0",
        alignItems: isDeskTop ? "end" : "end",
        position: isMobile ? "absolute" : "unset",
      }}
      className={`h-full z-[99]  ${
        isMobile ? "flex-row left-2 top-3 " : "flex"
      } justify-end items-end `}
    >
      <div
        style={{
          width: isMobile ? "100%" : isTablet ? "100%" : "60%",
          position: "relative",
        }}
        className={` transition-all 
         flex flex-row
          ${isMobile ? "rounded-xl" : "rounded-lg"}  ${
          isMobile ? "justify-between px-3" : "justify-between px-3 "
        }   backdrop-blur bg-[#2121217c] gap-3 items-center 
           h-auto py-2 items-center `}
      >
        <div
          aria-label="Account Setting"
          aria-describedby="Account Setting"
          aria-description="Account Setting"
          onClick={accountSetting}
          className="  rounded-full flex justify-between items-center w-auto h-auto "
        >
          <div className=" relative cursor-pointer  w-auto h-[100%] flex  rounded-full  bg-[#333333] ">
            {!isLoading && (
              <img
                style={{
                  opacity: account === true ? "0.5" : "1",
                }}
                className=" invert-none cursor-pointer hover:brightness-75 w-[40px] h-[40px] p-[3px]  bg-center object-center    object-cover rounded-full "
                src={adminProfile?.length > 10 ? adminProfile : userAvatar}
                alt="profile_picture"
                srcSet=""
              />
            )}

            <div className=" backdrop-blur bg-[#3333334b] cursor-pointer rounded-full absolute bottom-0 right-0 z-[99]  ">
              <img
                style={{
                  rotate: account === true ? "180deg" : "0deg",
                }}
                className=" invert-none w-[14px] "
                src={
                  "https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2FArrowDown.svg?alt=media&token=9c43da96-a4d0-4894-bc09-54ea459ee604"
                }
                alt="ArrowDown"
              />
            </div>
          </div>
        </div>

        <section
          className={`  flex-row
           lg flex justify-evenly  gap-3 items-center w-[80%]
             h-auto py-1 px-1 `}
        >
          {" "}
          <div
            aria-label="Notification"
            aria-describedby="Notification"
            aria-description="Notification"
            onClick={notification}
            className=" cursor-pointer flex w-[40px] h-[40px] rounded-full p-[10px] backdrop-blur-md bg-[#33333347] "
          >
            <img
              style={{
                opacity: noti === true ? "0.5" : "1",
              }}
              className=" invert-1 cursor-pointer hover:brightness-75 h-[100%]  bg-center object-center    object-cover rounded-full "
              src="https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2FNoti.svg?alt=media&token=1df0d59a-57be-43c4-8c62-fbf48aa8846e"
              alt="profile_picture"
              srcSet=""
            />
          </div>
          <div
            aria-label="Messenger"
            aria-describedby="Messenger"
            aria-description="Messenger"
            onClick={messengerShow}
            className=" cursor-pointer flex w-[40px] h-[40px] rounded-full p-[3px] backdrop-blur-md bg-[#33333347] "
          >
            <img
              style={{
                opacity: messenger === true ? "0.5" : "1",
              }}
              className=" invert-1 cursor-pointer hover:brightness-75 h-[100%]  bg-center object-center    object-cover rounded-full "
              src="https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2FMessenger.svg?alt=media&token=7f30cf84-cc33-4056-a28b-3741bb2aa9c2"
              alt="profile_picture"
              srcSet=""
            />
          </div>
          <div
            aria-label="Menu"
            aria-describedby="Menu"
            aria-description="Menu"
            onClick={admin?.user_name?.stringValue && menuShow}
            className=" cursor-pointer flex w-[40px] h-[40px] rounded-full p-[10px] backdrop-blur-md bg-[#33333347] "
          >
            <img
              style={{
                opacity: menu === true ? "0.5" : "1",
              }}
              className=" invert-1 cursor-pointer hover:brightness-75 h-full   bg-center object-center    object-cover  "
              src="https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2FMenu.svg?alt=media&token=065ece43-6480-486b-98e7-333c1be28381"
              alt="profile_picture"
              srcSet=""
            />
          </div>
        </section>

        <section
          style={{
            right: isMobile && "0%",
          }}
          className=" absolute w-full h-auto left-0    top-[100%] py-0 rounded-md "
        >
          <div
            id="account"
            style={{
              visibility: account === true ? "visible" : "hidden",
              height: account === true ? "auto" : "0vh",
              width:
                account === true
                  ? isMobile
                    ? fullWidth + "px"
                    : "100%"
                  : "100%",
            }}
            className={`Account flex w-full  backdrop-blur-lg backdrop-brightness-50   bg-[#212121] rounded-${
              isMobile ? "0" : "md"
            }`}
          >
            <div className=" w-full h-full flex flex-col p-2 justify-start items-start gap-2 ">
              <div
                onClick={() => dispatch(setAddProfile(true))}
                className={` text-[#d4d4d4]  flex w-[90%] px-2  py-1 hover:bg-[#3333336d] rounded-md cursor-pointer gap-2 h-[45px] justify-start items-center `}
              >
                <Icon path={mdiPlus} size={1} />
                <p className="font-[500] text-[16px] tracking-wide">
                  Change Profile Picture
                </p>
              </div>

              <NavLink
                to={`/${admin?.UID?.stringValue}`}
                className={` text-[#d4d4d4]  flex w-[90%] px-2  py-1 hover:bg-[#3333336d] rounded-md cursor-pointer gap-2 h-[45px] justify-start items-center `}
              >
                <img
                  className=" invert-none hover:brightness-75  rounded-full object-cover w-[40px] h-[40px] p-[3px] "
                  src={adminProfile?.length > 0 ? adminProfile : userAvatar}
                  alt=""
                  srcSet=""
                />
                <p className="font-[500] text-[16px] tracking-wide">
                  {admin?.user_name?.stringValue}
                </p>
              </NavLink>
              <Link
                onClick={async() => {
                 
                  
                  await UpdateData("status", admin?.UID?.stringValue, "pid", "offline", "").then(() => {
                    dispatch(setLogin(false));
                    dispatch(addAdmin([]));
                    dispatch(addUserData([]));
                    auth.currentUser && auth.signOut();

                  localStorage.clear();
                  Cookies.remove("adminData");
                  }).catch((error) => console.log(error));

                  
                }}
                className=" text-[#d4d4d4]  flex w-[90%] px-2  py-1 hover:bg-[#33333364] rounded-md cursor-pointer gap-2 h-[45px] justify-start items-center "
              >
                <p className=" hover:text-red-600 ">Logout</p>
              </Link>
            </div>
          </div>

          <div
            id="noti"
            style={{
              visibility: noti === true ? "visible" : "hidden",
              height: noti === true ? "90vh" : "0",
              width:
                noti === true
                  ? isMobile === true
                    ? fullWidth + "px"
                    : "100%"
                  : 0,
            }}
            className={`Noti flex w-full    backdrop-blur-md  rounded-md bg-[#2121214e] rounded-[${
              isMobile ? "0" : "6"
            }px]`}
          >
            <Noti/>
          </div>

          <div
            id="messenger"
            style={{
              visibility: messenger === true ? "visible" : "hidden",
              height: messenger === true ? isMobile === true?  "100vh" :"80vh" : "0",
              width:
                messenger === true
                  ? isMobile === true
                    ? fullWidth + "px"
                    : "100%"
                  : "100%",
            }}
            className={` flex w-full px-2 py-2 my-2 justify-start items-start -z-1   backdrop-blur-md bg-[#212121]    rounded-${
              isMobile ? "" : "md"
            } `}
          >
            {showChat ? <Messenger /> : <MessageCard />}
          </div>

          {!isMobile && (
            <div
              id="menu"
              style={{
                visibility: menu === true ? "visible" : "hidden",
                height: menu === true ? "80vh" : "0",
                width:
                  menu === true
                    ? isMobile === true
                      ? fullWidth + "px"
                      : "100%"
                    : 0,
              }}
              className={`Menu flex w-full px-2 py-2 my-2  backdrop-blur  rounded-md bg-[#2121214e] rounded-[${
                isMobile ? "0" : "6"
              }px]`}
            ></div>
          )}
        </section>

        {/* <div
          onClick={() => setMenuOn(!MenuOn)}
          className={`p-[1px] rounded-full backdrop-blur ${
            !isMobile && "hidden"
          } left-[25%]  bg-[#3333335a] absolute  ${
            MenuOn ? "bottom-[-5%]" : " bottom-[-15%] "
          } `}
        >
          <Icon path={MenuOn ? mdiChevronUp : mdiChevronDown} size={0.7} />
        </div> */}
      </div>
    </section>
  );
};

export default RightNav;
