import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  accountSettingOn,
  menuOn,
  messengerOn,
  notiOn,
} from "../redux/services/animateSlice";
import useChangeChildrenVisibility from "./ChangeChildrenVisibility";
import { Link } from "react-router-dom";
import { setLogin } from "../redux/services/authSlice";

const RightNav = () => {
  const { account, noti, messenger, menu } = useSelector(
    (state) => state.animateSlice
  );

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
    dispatch(
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
    dispatch(
      menuOn({
        menu: !menu,
      })
    );
  };

  const { isTablet, isMobile, isDeskTop } = useSelector(
    (state) => state.animateSlice
  );

  return (
    <section
      style={{
        width: isMobile ? "100%" : isTablet ? "70%" : "30%",
        justifyContent: isMobile ? "end" : isTablet ? "end" : "start",
        padding: isMobile ? "8px" : "0",
        alignItems: isDeskTop ? "center" : "end",
      }}
      className=" h-full flex justify-end items-center "
    >
      <div
        style={{
          width: isMobile ? "100%" : isTablet ? "100%" : "70%",
        }}
        className=" relative flex-row-reverse flex justify-start gap-3 items-center w-[70%] h-full p-2 "
      >
        <div
          onClick={accountSetting}
          className=" bg-[#212121] flex justify-between items-center w-auto h-full "
        >
          <div className=" relative cursor-pointer flex w-[40px] h-[40px] rounded-full p-[3px] bg-[#333333] ">
            <img
              style={{
                opacity: account === true ? "0.5" : "1",
              }}
              className=" cursor-pointer hover:brightness-75 h-[100%]  bg-center object-center    object-cover rounded-full "
              src="https://i.pinimg.com/originals/70/d5/50/70d5505465ff94d11d911f2f8b64bcda.jpg"
              alt="profile_picture"
              srcSet=""
            />
            <div className=" bg-[#333333] cursor-pointer rounded-full absolute bottom-0 right-0 z-[99]  ">
              <img
                style={{
                  rotate: account === true ? "180deg" : "0deg",
                }}
                className=" w-[14px] "
                src="https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2FArrowDown.svg?alt=media&token=9c43da96-a4d0-4894-bc09-54ea459ee604"
                alt="ArrowDown"
              />
            </div>
          </div>
        </div>

        <div
          onClick={notification}
          className=" cursor-pointer flex w-[40px] h-[40px] rounded-full p-[10px] bg-[#333333] "
        >
          <img
            style={{
              opacity: noti === true ? "0.5" : "1",
            }}
            className=" cursor-pointer hover:brightness-75 h-[100%]  bg-center object-center    object-cover rounded-full "
            src="https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2FNoti.svg?alt=media&token=1df0d59a-57be-43c4-8c62-fbf48aa8846e"
            alt="profile_picture"
            srcSet=""
          />
        </div>
        <div
          onClick={messengerShow}
          className=" cursor-pointer flex w-[40px] h-[40px] rounded-full p-[3px] bg-[#333333] "
        >
          <img
            style={{
              opacity: messenger === true ? "0.5" : "1",
            }}
            className=" cursor-pointer hover:brightness-75 h-[100%]  bg-center object-center    object-cover rounded-full "
            src="https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2FMessenger.svg?alt=media&token=7f30cf84-cc33-4056-a28b-3741bb2aa9c2"
            alt="profile_picture"
            srcSet=""
          />
        </div>
        <div
          onClick={menuShow}
          className=" cursor-pointer flex w-[40px] h-[40px] rounded-full p-[10px] bg-[#333333] "
        >
          <img
            style={{
              opacity: menu === true ? "0.5" : "1",
            }}
            className=" cursor-pointer hover:brightness-75 h-full   bg-center object-center    object-cover  "
            src="https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2FMenu.svg?alt=media&token=065ece43-6480-486b-98e7-333c1be28381"
            alt="profile_picture"
            srcSet=""
          />
        </div>

        <section className=" absolute w-full h-auto  top-[100%] py-3 rounded-md ">
          <div
            id="account"
            style={{
              visibility: account === true ? "visible" : "hidden",
              height: account === true ? "400px" : "0",
            }}
            className=" Account flex w-full   bg-[#212121] rounded-md "
          >
            <div className=" w-full h-full flex flex-col p-2 justify-start items-start gap-2 ">
              <div className=" text-[#d4d4d4]  flex w-[90%] px-2  py-1 hover:bg-[#333333] rounded-md cursor-pointer gap-2 h-[45px] justify-start items-center ">
                <img
                  className=" hover:brightness-75  rounded-full object-cover h-full "
                  src="https://i.pinimg.com/originals/70/d5/50/70d5505465ff94d11d911f2f8b64bcda.jpg"
                  alt=""
                  srcSet=""
                />
                <p className="font-[500] text-[18px] tracking-wide">
                  Kaung Myat Soe
                </p>
              </div>
              <Link
                onClick={() => dispatch(setLogin(false))}
                className=" text-[#d4d4d4]  flex w-[90%] px-2  py-1 hover:bg-[#333333] rounded-md cursor-pointer gap-2 h-[45px] justify-start items-center "
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
            }}
            className=" Noti flex w-full  bg-[#212121] rounded-md "
          ></div>

          <div
            id="messenger"
            style={{
              visibility: messenger === true ? "visible" : "hidden",
              height: messenger === true ? "80vh" : "0",
            }}
            className=" Messenger flex w-full  bg-[#212121] rounded-md "
          ></div>

          <div
            id="menu"
            style={{
              visibility: menu === true ? "visible" : "hidden",
              height: menu === true ? "70vh" : "0",
            }}
            className=" Menu flex w-full  bg-[#212121] rounded-md "
          ></div>
        </section>
      </div>
    </section>
  );
};

export default RightNav;
