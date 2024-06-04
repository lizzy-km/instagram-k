import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import ImageCard from "./ImageCard";
import GetData from "../redux/services/Hooks/GetData";

const Watch = () => {
  const navigate = useNavigate();

  const { admin, adminProfile, UserData, imageList, userAvatar } = useSelector(
    (state) => state.authSlice
  );

 

 

  return (
    <div className=" relative pt-[100px] bg-[#333333] h-auto flex flex-wrap    overflow-y-auto   w-[100%] gap-4  justify-center items-start  ">
        <GetData/>
      <div className=" flex flex-col gap-[40px] ">
        {imageList?.slice(0, 10).map((d) => {
          return <ImageCard key={d} d={d} />;
        })}
      </div>
      <div className=" flex flex-col gap-[40px] ">
        {imageList
          ?.slice(10, 20)
          .reverse()
          .map((d) => {
            return <ImageCard key={d} d={d} />;
          })}
      </div>
      <div className=" flex flex-col gap-[40px] ">
        {imageList?.slice(20, 30).map((d) => {
          return <ImageCard key={d} d={d} />;
        })}
      </div>
      <div className=" flex flex-col gap-[40px] ">
        {imageList?.slice(30, 40).map((d) => {
          return <ImageCard key={d} d={d} />;
        })}
      </div>
      <div className=" flex flex-col gap-[40px] ">
        {imageList
          ?.slice(40, 50)
          .reverse()
          .map((d) => {
            return <ImageCard key={d} d={d} />;
          })}
      </div>
    </div>
  );
};

export default Watch;
