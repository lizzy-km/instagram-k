import React, { useEffect, useState } from "react";
import StoryCard from "./StoryCard";
import { useDispatch, useSelector } from "react-redux";
import GetData from "../../redux/services/Hooks/useGetData";
import { addStory } from "../../redux/services/authSlice";
import OtherStoryCard from "./OtherStoryCard";
import addData from "../../redux/services/Hooks/AddData";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { setShowStory } from "../../redux/services/animateSlice";

const Story = () => {
  const [plus, setPlus] = useState(false);
  const { UserData, Story, admin, adminProfile } = useSelector(
    (state) => state.authSlice
  );
  const dispatch = useDispatch();

  const createStory = () => {
    setPlus(!plus);
    dispatch(setShowStory(true));
  };

  const userData = UserData;

  const user = userData?.filter(
    (d) =>d?._document.data.value.mapValue.fields?.story.arrayValue.values.length >0?
      d?._document.data.value.mapValue.fields.story?.arrayValue.values[0]
        ?.mapValue.fields.STID?.stringValue?.length > 0 : false
  );

  const userStory = admin.story.arrayValue.values?.map(
    (d) => d.mapValue.fields
  );

  const otherStory = userData?.filter(
    (d) =>
      d._document.data.value.mapValue.fields.UID.stringValue !==
      admin.UID.stringValue
  );

  const getData = async () => {
    const data = await getDocs(collection(firestore, "story"));

    const doc = data.docs;

    dispatch(addStory(doc));
  };

  useEffect(() => {
    getData();
  }, []);

  const pf = admin?.profile_picture?.arrayValue.values.filter(
    (d) => d?.mapValue.fields
  )[0]; // Check this profile picture is currently use

  const [translateX, setTranslateX] = useState(0);
  const [count, setCount] = useState(0);

  const otherHasStory = otherStory.filter(
    (d) =>
      d._document.data.value.mapValue.fields.story.arrayValue.values[0]
        ?.mapValue.fields.STID?.stringValue?.length > 0
  );
  const storyCard = document.getElementById("story_id");
  const storyWidth = storyCard?.clientWidth;

  

  const translateStoryCard = (type) => {
 type === "next"
      ? (setTranslateX(
          translateX + 157
        ))
      : 
        setTranslateX(
          translateX - 157
        )

    type === 'next' ? setCount(count+1) : setCount(count-1)
  };

  const { isTablet, isMobile, isDeskTop } = useSelector(
    (state) => state.animateSlice
  );
  return (
    <div id="story_id" className=" story  ">
      <div  className=" absolute hidden top-0  z-[99999] text-black bg-slate-100 p-1 " >
        {
         translateX
        }
        {
         " <->"
        }
        {
          count
        }
       {  " <->"}
        {
          storyWidth
        }
      </div>
      <div style={{
        overflowX: isMobile ? 'scroll' :'hidden'
      }} className=" story-holder   ">
        {isDeskTop && otherStory?.length > 1 && (
          <>
            { (((user.length+1)-(storyWidth/157))).toFixed(0) > count&& (
              <div className=" nextStory   ">
                <div
                  onClick={() => translateStoryCard("next")}
                  className={`rotate-[0deg] moveStory`}
                >
                  <div className=" absolute top-[37%] left-[37%] rotate-45 w-[30%] h-[2px] bg-[#d4d4d4] rounded-full "></div>
                  <div className=" absolute bottom-[37%] left-[37%] rotate-[135deg] w-[30%] h-[2px] bg-[#d4d4d4] rounded-full "></div>
                </div>
              </div>
            )}
            {0 < count && (
              <div className=" prevStory   ">
                <div
                  onClick={() => translateStoryCard("prev")}
                  className={`rotate-[180deg] moveStory`}
                >
                  <div className=" absolute top-[37%] left-[37%] rotate-45 w-[30%] h-[2px] bg-[#d4d4d4] rounded-full "></div>
                  <div className=" absolute bottom-[37%] left-[37%] rotate-[135deg] w-[30%] h-[2px] bg-[#d4d4d4] rounded-full "></div>
                </div>
              </div>
            )}
          </>
        )}

        <div
          style={{
            translate: -translateX,
          }}
          className=" storyCreateCard    "
        >
          <div className=" h-full flex flex-col justify-between items-center rounded-md ">
            <div className="max-h-[80%] h-[80%] z-0  bg-center object-center overflow-hidden    object-cover rounded-t-md ">
              {pf && (
                <img
                  className=" cursor-pointer hover:scale-105  h-[100%] w-[145px]  bg-center object-center    object-cover rounded-t-md "
                  src={adminProfile}
                  alt="profile_picture"
                  srcSet=""
                />
              )}
            </div>

            <div className=" z-n1  relative w-full h-[20%] flex rounded-b-md justify-center items-center ">
              <div className=" p-[3px] absolute bg-[#242526] rounded-full w-[40px] h-[40px] top-[-30%] ">
                <div
                  onClick={createStory}
                  style={{
                    rotate: plus === true ? "180deg" : "0deg",
                  }}
                  className=" cursor-pointer flex justify-center items-center relative rounded-full w-full h-full bg-[#0866ff] "
                >
                  <div className=" w-[50%] rounded-full h-[2px] bg-slate-200 "></div>
                  <div className=" absolute w-[2px] rounded-full h-[50%] bg-slate-200 "></div>
                </div>
              </div>
              <div className=" flex justify-center items-center pt-4 text-[0.8rem] font-[600] w-full tracking-wide  ">
                Create story
              </div>
            </div>
          </div>
        </div>

        {userStory && <StoryCard data={userStory} translateX={translateX} />}

        {otherStory?.length > 0 &&
          otherStory?.map((d) => {
            return (
              <OtherStoryCard
                data={d}
                translateX={translateX}
                key={d?.UID?.stringValue}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Story;
