import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { blurOn, setArea } from "../redux/services/animateSlice";
import useChangeChildrenVisibility from "./ChangeChildrenVisibility";

const CreatePostBox = () => {
  const [option, setOption] = useState("Public");
  const [icon, setIcon] = useState("/src/Components/assets/Public.png");

  const privacyData = [
    {
      id: "1",
      option: "Public",
      icon: "/src/Components/assets/Public.png",
    },
    {
      id: "2",
      option: "Friends",
      icon: "/src/Components/assets/Friend.png",
    },
    {
      id: "3",
      option: "Only me",
      icon: "/src/Components/assets/OnlyMe.png",
    },
  ];

  const dispatch = useDispatch();
  const [privacy, setPrivacy] = useState(false);
  const Create_post = document.getElementById("Create_post");
  const { blur } = useSelector((state) => state.animateSlice);

  useEffect(() => {
    blur === false
      ? useChangeChildrenVisibility(Create_post, "hidden")
      : useChangeChildrenVisibility(Create_post, "visible");
  }, [blur, privacy]);

  useEffect(() => {
    dispatch(
      setArea({
        width: window.outerWidth,
        height: window.outerHeight,
      })
    );
  }, []);

  return (
    <div
      id="Create_post"
      style={{
        visibility: blur === true ? "visible" : "hidden",
      }}
      className=" text-[#d4d4d4] p-2 Create_post flex flex-col justify-between items-center rounded-md bg-[#18191a] w-[40%] h-[40%] "
    >
      <div
        style={{
          width: blur === true ? "100%" : "100%",
          height: blur === true ? "100%" : "0%",
        }}
        className=" flex flex-col justify-start items-start "
      >
        <div className=" flex w-full h-auto justify-between items-start ">
          <div className=" w-[80%] h-[140px] p-2  flex flex-col justify-start items-center  rounded-md ">
            <div className=" w-full h-[50px] flex justify-start items-start  ">
              <div className=" cursor-pointer relative flex w-[50px]  h-[100%] justify-center items-center  rounded-full ">
                <img
                  className=" hover:brightness-75  rounded-full object-cover w-full h-full "
                  src="https://i.pinimg.com/originals/70/d5/50/70d5505465ff94d11d911f2f8b64bcda.jpg"
                  alt=""
                  srcSet=""
                />
              </div>
              <div className=" relative px-2  w-[80%] font-[600] flex flex-col tracking-wide text-[15px] justify-start items-start ">
                <p>Kaung Myat Soe</p>
                <div
                  onClick={() => setPrivacy(!privacy)}
                  className="  cursor-pointer hover:brightness-[120%] flex justify-center gap-1 items-center p-1 rounded w-auto h-[25px] bg-[#212121] "
                >
                  <div className="  flex justify-center items-center  ">
                    <img className="  w-[14px] flex   " src={icon} alt="" />
                  </div>
                  <div className=" tracking-wide font-normal text-[12px] flex flex-col justify-center items-center ">
                    {option}
                  </div>

                  <div className=" flex justify-center items-center ">
                    <img
                      style={{
                        rotate: privacy === true ? "180deg" : "0deg",
                      }}
                      className=" w-[16px] h-[16px] "
                      src="/src/Components/ArrowDown.svg"
                      alt=""
                    />
                  </div>
                </div>
                <div
                  id="privacy_option"
                  style={{
                    height: privacy === true ? "85px" : "0",
                    visibility: privacy === true ? "visible" : "hidden",
                    bottom: privacy === true ? "-190%" : "0%",
                  }}
                  className=" tracking-wide font-normal text-[12px] flex flex-col justify-start items-start  absolute w-auto bg-[#212121] px-2 rounded py-1 "
                >
                  {privacyData?.map((data) => {
                    return (
                      <div
                        style={{
                          opacity: privacy === true ? "1" : "0",
                        }}
                        onClick={() => {
                          setOption(data.option);
                          setPrivacy(!privacy);
                          setIcon(data.icon);
                        }}
                        key={data.id}
                        className=" px-1 justify-between items-center gap-1 rounded py-1 cursor-pointer hover:bg-[#333333] flex hover:brightness-125 "
                      >
                        <img
                          className=" h-[14px] w-[14px] flex   "
                          src={data.icon}
                          alt=""
                        />
                        <p> {data.option} </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={() => dispatch(blurOn({ blur: false }))}
            id="closeCreatePost"
            className=" hover:-rotate-90 h-[40px] cursor-pointer relative rounded-full bg-[#212121] flex justify-center items-center w-[40px] "
          >
            <div className=" absolute rotate-45  w-[2px] h-[45%] rounded-full bg-[#e4e6ebb5] "></div>
            <div className=" absolute rotate-45  w-[45%] h-[2px] rounded-full bg-[#e4e6ebb5] "></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostBox;
