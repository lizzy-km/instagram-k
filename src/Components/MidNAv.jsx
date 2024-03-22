import React from "react";
import { NavLink } from "react-router-dom";

const MidNAv = () => {
  return (
    <section className="  h-full flex justify-center items-center w-[40%] ">
      <div className=" flex w-[80%] h-full  justify-between items-center ">
      <NavLink to={"/"} className=" relative py-1 w-[25%] h-full">
          <div className=" out_line absolute bottom-0  rounded-t-lg z-[9999] w-full h-1 " />

          <div className="transition-colors rounded-md py-0 justify-center items-center cursor-pointer hover:bg-slate-600 flex h-full ">
            <img
              className=" w-[24px] h-[24px] "
              src="/src/Components/assets/Home.svg"
              alt=""
              srcset=""
            />
          </div>
        </NavLink>

        <NavLink to={"/watch"} className=" relative py-1 w-[25%] h-full">
          <div className=" out_line absolute bottom-0  rounded-t-lg z-[9999] w-full h-1 " />

          <div className="transition-colors rounded-md py-0 justify-center items-center cursor-pointer hover:bg-slate-600 flex h-full ">
            <img
              className=" w-[24px] h-[24px] "
              src="/src/Components/assets/Watch.svg"
              alt=""
              srcset=""
            />
          </div>
        </NavLink>
        <NavLink to={"/group"} className=" relative py-1 w-[25%] h-full">
          <div className=" out_line absolute bottom-0  rounded-t-lg z-[9999] w-full h-1 " />

          <div className="transition-colors rounded-md py-0 justify-center items-center cursor-pointer hover:bg-slate-600 flex h-full ">
            <img
              className=" w-[24px] h-[24px] "
              src="/src/Components/assets/Group.svg"
              alt=""
              srcset=""
            />
          </div>
        </NavLink>
        <NavLink to={"/game"} className=" relative py-1 w-[25%] h-full">
          <div className=" out_line absolute bottom-0  rounded-t-lg z-[9999] w-full h-1 " />

          <div className="transition-colors rounded-md py-0 justify-center items-center cursor-pointer hover:bg-slate-600 flex h-full ">
            <img
              className=" w-[24px] h-[24px] "
              src="/src/Components/assets/Game.svg"
              alt=""
              srcset=""
            />
          </div>
        </NavLink>
      </div>
    </section>
  );
};

export default MidNAv;
