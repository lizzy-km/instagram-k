import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import ImageCard from "./ImageCard";
import GetData from "../redux/services/Hooks/GetData";
import { useEffect, useState } from "react";

const Watch = () => {
  const navigate = useNavigate();

  const { admin, adminProfile, UserData, imageList, userAvatar } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );
  const { isTablet, isMobile, isDeskTop } = useSelector(
    (state) => state.animateSlice
  );
  const width = document.getElementById("mainWidth");
  const [mainWidth, setMainWidth] = useState(width?.clientWidth);
  const cardWidth = 200;

  const deskWidth = mainWidth / cardWidth;

  const deskCount = deskWidth > 0 ? deskWidth : 9

  const totalCardRow = isDeskTop
    ? deskCount
    : isMobile
    ? 1
    : 3;

  const cardPerCol = imageList?.length / totalCardRow;
  let newArray = [];


  const [realData, setRealData] = useState([]);

  window.addEventListener("resize", () => {
    const width = document.getElementById("mainWidth");
    setMainWidth(width?.clientWidth);
  });

 

  useEffect(() => {
    for (let i = 0; i < totalCardRow?.toFixed(0); i++) {
      newArray?.push([imageList.slice(i * cardPerCol, cardPerCol * (i +1))]);
      setRealData(newArray);
    }
  }, [imageList, UserData]);

  return (
    <div

      id="mainWidth"
      className=" relative pt-[100px]  h-auto flex  min-h-screen     w-[95%] p-2   justify-center items-center  "
    >
      <div  className=" flex w-auto justify-center  gap-3 rounded-lg  items-center">
        {realData.reverse()?.map((d,index) => {
          return (
            <div key={index} className="  place-self-start justify-center   w-full flex flex-wrap gap-[16px] ">
              {d?.length > 0 &&
                d[0]?.map((dd) => {
                  return <ImageCard key={dd.url} d={dd} />;
                })}
            </div>
          );
        })}
      </div>
      <GetData />

    </div>
  );
};

export default Watch;
