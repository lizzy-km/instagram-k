import React, { useEffect, useState } from "react";
import StoryCard from "./StoryCard";
import { useDispatch, useSelector } from "react-redux";
import GetData from "../../redux/services/Hooks/useGetData";
import { addStory } from "../../redux/services/authSlice";
import OtherStoryCard from "./OtherStoryCard";
import addData from "../../redux/services/Hooks/AddData";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";

const Story = () => {
  const [plus, setPlus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { UserData, Story,admin } = useSelector((state) => state.authSlice);

  const email = 'hannipham@gmail.com'
  const username = 'Kaung Myat Soe'

  const createStory = () => {
    setPlus(!plus);
    addData('story',email,username)
  };

  const dispatch = useDispatch();


  const userData = UserData;


  const user = userData
    ?.map((d) => d)
    ?.filter((d) => d?.isLogin?.booleanValue === true)[0];


  

  const userStory = Story?.filter(
    (d) =>
      d._document.data.value.mapValue.fields.STUID?.stringValue ===
    admin.UID?.stringValue
  );

  const otherStory =  Story?.filter(
    (d) =>
      d._document.data.value.mapValue.fieldsSTUID?.stringValue !==
    admin?.UID?.stringValue
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
    (d) => d?.mapValue.fields.isActive.booleanValue === true
  )[0]; // Check this profile picture is currently use


  const [translateX, setTranslateX] = useState(0);

  const translateStoryCard = () => {
    Story.length * 150 - 400 >= translateX
      ? setTranslateX(translateX + (Story.length * 150) / 4)
      : setTranslateX(0);
  };

  const { isTablet, isMobile, isDeskTop } = useSelector(
    (state) => state.animateSlice
  );
  return (
    <div className=" story  ">
      <div className=" story-holder  ">
        {isDeskTop && Story?.length > 1 && (
          <div className=" nextStory   ">
            <div onClick={translateStoryCard} className=" moveStory ">
              <div className=" absolute top-[37%] left-[37%] rotate-45 w-[30%] h-[2px] bg-[#d4d4d4] rounded-full "></div>
              <div className=" absolute bottom-[37%] left-[37%] rotate-[135deg] w-[30%] h-[2px] bg-[#d4d4d4] rounded-full "></div>
            </div>
          </div>
        )}

        <div
          style={{
            translate: -translateX,
          }}
          className=" storyCreateCard   "
        >
          <div className=" h-full flex flex-col justify-between items-center rounded-md ">
            <div className="max-h-[80%] h-[80%] z-0  bg-center object-center overflow-hidden    object-cover rounded-t-md ">
             
             {
              pf && <img
              className=" cursor-pointer hover:scale-105 h-[100%] max-w-[140px]  bg-center object-center    object-cover rounded-t-md "
              src={pf?.mapValue.fields.src.stringValue}
              alt="profile_picture"
              srcSet=""
            />
             }
              
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

       {
        userStory &&
          userStory?.map((arr) => {
            return (
              <StoryCard
                data={arr}
                translateX={translateX}
                key={arr?.STID?.stringValue}
              />
            );
          })
          } 

          {
             otherStory?.length > 0 &&
             otherStory?.map((arr) => {
               return (
                 <OtherStoryCard
                   data={arr}
                   translateX={translateX}
                   key={arr?.STID?.stringValue}
                 />
               );
             })
          } 
      </div>
    </div>
  );
};

export default Story;
