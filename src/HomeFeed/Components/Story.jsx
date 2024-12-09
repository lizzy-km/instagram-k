import React, { useEffect, useState } from "react";
import StoryCard from "./StoryCard";
import { useDispatch, useSelector } from "react-redux";
import OtherStoryCard from "./OtherStoryCard";
import { setShowStory } from "../../redux/services/animateSlice";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";

const Story = () => {
  const [plus, setPlus] = useState(false);
  const { UserData, Story, admin, adminProfile, userAvatar, updateFeed } =
    useSelector((deserializedState) => deserializedState.authSlice);
  const dispatch = useDispatch();

  const createStory = () => {
    setPlus(!plus);
    dispatch(setShowStory(true));
  };
  const realTime = Date.now(); //Date Now

  const userData = UserData;

  const [USER_STORYS, setUSER_STORYS] = useState([]);

  let user = [];

  for (let i = 0; i < userData?.length; i++) {
    const usd = userData[i];
    const UID = usd.id;

    for (let ii = 0; ii < USER_STORYS?.length; ii++) {
      const ust = USER_STORYS[ii];

      const STOID =
        ust?._document?.data?.value.mapValue.fields?.STORY_OWNER_DETAIL
          ?.mapValue.fields?.STOID?.stringValue;

      if (UID === STOID) {
        user.push(usd);
      }
    }
  }

  const arrayWithDuplicates = user;

  const uniqueArray = arrayWithDuplicates.reduce((acc, curr) => {
    if (!acc.includes(curr)) {
      acc.push(curr);
    }
    return acc;
  }, []);
  const userStory = USER_STORYS?.filter(
    (d) =>
      d._document.data.value.mapValue.fields.STORY_OWNER_DETAIL?.mapValue.fields
        .STOID?.stringValue === admin.UID.stringValue
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function USER_STORY() {
      setIsLoading(true);

      await getDocs(collection(firestore, "/USER_STORYS"))
        .then((data) => {
          setUSER_STORYS(data?.docs);
          setIsLoading(false);
        })
        .catch((error) => console.log(error))
        .finally(() => {
          setIsLoading(false);

          data?.docs?.map(async (data) => {
            const storyRef = doc(firestore, "/USER_STORYS", `/${data?.id}`);

            const miliSec =
              data?._document?.createTime.timestamp.seconds * 1000;

            const diffTime = realTime - miliSec;
            const timeInSec = diffTime / 1000;
            const timeINMin = (timeInSec / 60).toFixed(0);
            const timeInHr = (timeINMin / 60).toFixed(0);

            timeInHr > 23 ? await deleteDoc(storyRef) : null;
          });
        });
    }

    USER_STORY();
  }, []);

  useEffect(() => {
    async function USER_STORY() {
      setIsLoading(true);

      await getDocs(collection(firestore, "/USER_STORYS"))
        .then((data) => {
          setUSER_STORYS(data?.docs);
          setIsLoading(false);
        })
        .catch((error) => console.log(error))
        .finally(() => {
          setIsLoading(false);

          data?.docs?.map(async (data) => {
            const storyRef = doc(firestore, "/USER_STORYS", `/${data?.id}`);

            const miliSec =
              data?._document?.createTime.timestamp.seconds * 1000;

            const diffTime = realTime - miliSec;
            const timeInSec = diffTime / 1000;
            const timeINMin = (timeInSec / 60).toFixed(0);
            const timeInHr = (timeINMin / 60).toFixed(0);

            timeInHr > 23 ? await deleteDoc(storyRef) : null;
          });
        });
    }

    USER_STORY();
  }, [updateFeed]);

  const [translateX, setTranslateX] = useState(0);
  const [count, setCount] = useState(0);

  const storyCard = document.getElementById("story_id");
  const storyWidth = storyCard?.clientWidth;

  const translateStoryCard = (type) => {
    type === "next"
      ? setTranslateX(translateX + 157)
      : setTranslateX(translateX - 157);

    type === "next" ? setCount(count + 1) : setCount(count - 1);
  };

  const { isTablet, isMobile, isDeskTop } = useSelector(
    (state) => state.animateSlice
  );

  const StoryDataOnLoading = (
    <div id="story_id" className=" story px-2 rounded-lg  ">
      <div
        style={{
          overflowX: isMobile ? "scroll" : "hidden",
        }}
        className=" story-holder rounded-lg  "
      >
        <div
          style={{
            translate: -translateX,
          }}
          className=" storyCreateCard  transition-all   "
        >
          <div className=" h-full flex flex-col justify-between items-center rounded-md ">
            <div className="max-h-[80%] h-[80%] z-0  bg-center object-center overflow-hidden    object-cover rounded-t-md ">
              <img
                className=" invert-none transition-all  cursor-pointer hover:scale-105  h-[100%] w-[145px]  bg-center object-center    object-cover rounded-t-md "
                src={adminProfile?.length > 10 ? adminProfile : userAvatar}
                alt="profile_picture"
                srcSet=""
              />
            </div>

            <div className=" z-n1  relative w-full h-[20%] flex rounded-b-md justify-center items-center ">
              <div className=" p-[3px] absolute bg-[#242526] rounded-full w-[40px] h-[40px] top-[-30%] ">
                <div
                  onClick={createStory}
                  style={{
                    rotate: plus === true ? "180deg" : "0deg",
                  }}
                  className=" cursor-pointer flex justify-center items-center relative rounded-full w-full h-full bg-[#ca3e47] "
                >
                  <div className=" w-[50%] rounded-full h-[2px] bg-[#d4d4d4] "></div>
                  <div className=" absolute w-[2px] rounded-full h-[50%] bg-[#d4d4d4]"></div>
                </div>
              </div>
              <div className=" flex justify-center items-center pt-4 text-[0.8rem] font-[600] w-full tracking-wide  ">
                Create story
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const StoryDataOnLoaded = (
    <div id="story_id" className=" story px-2 rounded-lg  ">
      <div className=" absolute hidden top-0  z-[99999] text-black bg-slate-100 p-1 ">
        {translateX}
        {" <->"}
        {count}
        {" <->"}
        {storyWidth}
      </div>
      <div
        style={{
          overflowX: isMobile ? "scroll" : "hidden",
        }}
        className=" story-holder rounded-lg  "
      >
        {isDeskTop && uniqueArray?.length > 1 && (
          <>
            {(uniqueArray?.length + 1 - storyWidth / 150).toFixed(0) >
              count && (
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
          className=" storyCreateCard  transition-all   "
        >
          <div className=" h-full flex flex-col justify-between items-center rounded-md ">
            <div className="max-h-[80%] h-[80%] z-0  bg-center object-center overflow-hidden    object-cover rounded-t-md ">
              <img
                className=" invert-none transition-all  cursor-pointer hover:scale-105  h-[100%] w-[145px]  bg-center object-center    object-cover rounded-t-md "
                src={adminProfile?.length > 10 ? adminProfile : userAvatar}
                alt="profile_picture"
                srcSet=""
              />
            </div>

            <div className=" z-n1  relative w-full h-[20%] flex rounded-b-md justify-center items-center ">
              <div className=" p-[3px] absolute bg-[#242526] rounded-full w-[40px] h-[40px] top-[-30%] ">
                <div
                  onClick={createStory}
                  style={{
                    rotate: plus === true ? "180deg" : "0deg",
                  }}
                  className=" cursor-pointer flex justify-center items-center relative rounded-full w-full h-full bg-[#ca3e47] "
                >
                  <div className=" w-[50%] rounded-full h-[2px] bg-[#d4d4d4] "></div>
                  <div className=" absolute w-[2px] rounded-full h-[50%] bg-[#d4d4d4]"></div>
                </div>
              </div>
              <div className=" flex justify-center items-center pt-4 text-[0.8rem] font-[600] w-full tracking-wide  ">
                Create story
              </div>
            </div>
          </div>
        </div>

        {userStory && !isLoading && (
          <StoryCard
            data={userStory[[userStory?.length - 1]]}
            translateX={translateX}
          />
        )}

        {uniqueArray?.length > 0 &&
          !isLoading &&
          uniqueArray?.map((d) => {
            return (
              <OtherStoryCard data={d} translateX={translateX} key={d?.id} />
            );
          })}
      </div>
    </div>
  );

  const [StoryEl, setStoryEl] = useState(StoryDataOnLoading);

  useEffect(() => {
    setStoryEl(isLoading ? StoryDataOnLoading : StoryDataOnLoaded);
  }, [isLoading]);
  useEffect(() => {
    setStoryEl(isLoading ? StoryDataOnLoading : StoryDataOnLoaded);
  }, []);

  return StoryEl;
};

export default Story;
