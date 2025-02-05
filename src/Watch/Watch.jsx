import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import ImageCard from "./ImageCard";
import GetData from "../redux/services/Hooks/GetData";
import { Component, useEffect, useState } from "react";
import { unmountComponentAtNode } from "react-dom";

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
  const cardWidth = isDeskTop
    ? (mainWidth / 100) * 10
    : isMobile
    ? mainWidth
    : isTablet
    ? (mainWidth / 100) * 30
    : 200;

  const deskWidth = mainWidth / (+cardWidth + 25);

  const deskCount = deskWidth > 0 ? deskWidth : 7;

  const totalCardRow = isDeskTop ? deskCount : isMobile ? 1 : 3;

  const cardPerCol = imageList?.length / totalCardRow;
  let newArray = [];

  const [realData, setRealData] = useState([]);

  window.addEventListener("resize", () => {
    const width = document.getElementById("mainWidth");
    setMainWidth(width?.clientWidth);
  });

  useEffect(() => {
    for (let i = 0; i < totalCardRow?.toFixed(0); i++) {
      newArray?.push([imageList.slice(i * cardPerCol, cardPerCol * (i + 1))]);
      setRealData(newArray);
    }
  }, [imageList, UserData]);

  useEffect(()=> {
    document.title = "Queed | Gallery"

  },[])

  return (
    <div
      id="mainWidth"
      className=" relative pt-[100px]  h-auto flex  min-h-screen     w-[95%] p-2   justify-center items-center  "
    >
      <div className=" flex w-auto justify-center  gap-3 rounded-lg  items-center">
        {realData.reverse()?.map((d, index) => {
          return (
            <div
              key={index}
              className="  place-self-start justify-center   w-full flex flex-wrap gap-[2rem] "
            >
              {d?.length > 0 &&
                d[0]?.map((dd) => {
                  return (
                    <ImageCard cardWidth={cardWidth} key={dd.url} d={dd} />
                  );
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
