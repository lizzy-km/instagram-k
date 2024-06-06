import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Icon from "@mdi/react";
import { mdiImageMultiple } from "@mdi/js";


const MidNAv = () => {
  const { isTablet, isMobile, isDeskTop } = useSelector(
    (state) => state.animateSlice
  );
  return (
    <section
    style={{
      width: isMobile ? '90%' : isTablet ?  '60%' : '40%'
    }}
     className="  backdrop-blur-md bg-[#2121217c] rounded-lg h-[60px] flex justify-center items-center  ">
      <div className=" flex w-[80%] h-full  justify-between items-center ">
      <NavLink to={"/"} className=" relative py-1 w-[25%] h-full">
          <div className=" out_line absolute bottom-0  rounded-t-lg z-[99] w-full h-1 " />

          <div className="transition-colors rounded-md py-0 justify-center items-center cursor-pointer hover:bg-slate-600 flex h-full ">
            <img
              className=" w-[24px] h-[24px] "
              src="https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2FHome.svg?alt=media&token=b7f4e8d9-417d-4d3d-8da6-86e3db396ce4"
              alt=""
              srcSet=""
            />
          </div>
        </NavLink>

        <NavLink to={"/gallery"} className=" relative py-1 w-[25%] h-full">
          <div className=" out_line absolute bottom-0  rounded-t-lg z-[99] w-full h-1 " />

          <div className="transition-colors rounded-md py-0 justify-center items-center cursor-pointer hover:bg-slate-600 flex h-full ">
          <Icon path={mdiImageMultiple} size={1} />
          </div>
        </NavLink>
        <NavLink to={"/group"} className=" relative py-1 w-[25%] h-full">
          <div className=" out_line absolute bottom-0  rounded-t-lg z-[99] w-full h-1 " />

          <div className="transition-colors rounded-md py-0 justify-center items-center cursor-pointer hover:bg-slate-600 flex h-full ">
            <img
              className=" w-[24px] h-[24px] "
              src="https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2FGroup.svg?alt=media&token=d53ee387-e148-4895-976a-31979aec3560"
              alt=""
              srcSet=""
            />
          </div>
        </NavLink>
        <NavLink to={"/game"} className=" relative py-1 w-[25%] h-full">
          <div className=" out_line absolute bottom-0  rounded-t-lg z-[9999] w-full h-1 " />

          <div className="transition-colors rounded-md py-0 justify-center items-center cursor-pointer hover:bg-slate-600 flex h-full ">
            <img
              className=" w-[24px] h-[24px] "
              src="https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2FGame.svg?alt=media&token=f3b77ba1-9a48-4ddf-89b0-18320dcfbdb3"
              alt=""
              srcSet=""
            />
          </div>
        </NavLink>
      </div>
    </section>
  );
};

export default MidNAv;
