import { mdiTruckDelivery } from "@mdi/js";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

const ImageCard = ({ d, cardWidth }) => {
  const { userAvatar } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );
  const { isTablet, isMobile, isDeskTop } = useSelector(
    (state) => state.animateSlice
  );

  const [isLoading, setIsLoading] = useState(true);

  function getImageSize(imageLink) {
    setIsLoading(true);

    Promise.all(imageLink)
      .then((data) => {
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    getImageSize(d?.url);
  }, []);

  const [isShow, setIsShow] = useState(false);
  return (
    <div
      style={{
        top: 0,
        width: isMobile ? "100%" : cardWidth,
      }}
      className=" relative cursor-pointer   h-auto  flex flex-col gap-3 justify-start items-start  rounded-lg "
    >
      {isLoading === true ? (
        <div className=" invert-none w-full bg-[#24242457]  h-[100%] object-cover rounded-lg "></div>
      ) : (
        <img
          style={{
            width: isMobile ? "100%" : cardWidth,
          }}
          className=" invert-none  h-[100%] object-cover rounded-lg "
          src={d?.url}
          alt=""
          srcset=""
        />
      )}

      <div
        onMouseEnter={() => setIsShow(true)}
        onMouseLeave={() => setIsShow(false)}
        style={{
          visibility: isShow ? "visible" : "visible",
        }}
        className="  w-full h-auto bg-[#21212157] backdrop-blur  gap-0  left-0 top-0 rounded-t-lg   flex justify-start p-2 items-start "
      >
        <NavLink
          to={`/${d.UID}`}
          className="  relative   rounded-sm w-[26px]  h-[26px] justify-center items-center   "
        >
          <div className=" -z-10 rotate-[0deg] rounded-sm   bg-[#ca3e4796] w-[26px] h-[26px] absolute "></div>
          <div className=" -z-10 rotate-[20deg] rounded-sm   bg-[#ca3e4796] w-[26px] h-[26px] absolute "></div>
          <div className=" -z-10 rotate-[40deg] rounded-sm   bg-[#ca3e4796] w-[26px] h-[26px] absolute "></div>
          <div className=" -z-10 rotate-[60deg] rounded-sm   bg-[#ca3e4796] w-[26px] h-[26px] absolute "></div>
          <div className=" -z-10 rotate-[80deg] rounded-sm   bg-[#ca3e4796] w-[26px] h-[26px] absolute "></div>

          <img
            className=" invert-none w-full   h-full rounded-full object-cover cursor-pointer "
            src={d?.userProfile?.length > 0 ? d?.userProfile : userAvatar}
            alt=""
            srcset=""
          />
        </NavLink>
        <NavLink
          to={`/${d.UID}`}
          className=" cursor-pointer rounded-br px-2 object-cover  h-full min-w-[100px]  w-auto flex justify-start items-center tracking-wide text-[12px]  "
        >
          <p>{d.name}</p>
        </NavLink>
      </div>
    </div>
  );
};

export default ImageCard;
