import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStoryId } from "../../redux/services/authSlice";
import { setViewStory } from "../../redux/services/animateSlice";
import UserCard from "./UserCard";
import { mdiWindowClose } from "@mdi/js";
import Icon from "@mdi/react";
import ViewStoryCard from "./ViewStoryCard";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { useCollectionData, useCollectionDataOnce } from "react-firebase-hooks/firestore";

const ViewStory = () => {
  const {  updateFeed } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const dispatch = useDispatch();

  const userRf = collection(firestore, "users");
  const userQuery = query(userRf);
  const [TUser] = useCollectionDataOnce(userQuery, { idField: "id" });


  
  const userData = TUser;

  const [USER_STORYS, setUSER_STORYS] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function USER_STORY() {
      setIsLoading(true);

      await getDocs(collection(firestore, "/USER_STORYS"))
        .then((data) => {
          setUSER_STORYS(data?.docs);
        })
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));
    }
    USER_STORY();
  }, []);

  useEffect(() => {
    async function USER_STORY() {
      setIsLoading(true);

      await getDocs(collection(firestore, "/USER_STORYS"))
        .then((data) => setUSER_STORYS(data?.docs))
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));
    }
    USER_STORY();
  }, [updateFeed]);

 
  let user = []; 

  for (let i = 0; i < userData?.length; i++) {
    const usd = userData[i];
    const UID = usd.UID;


    for (let ii = 0; ii < USER_STORYS?.length; ii++) {
      const ust = USER_STORYS[ii];

      const STOID =
        ust?._document?.data?.value.mapValue.fields?.STORY_OWNER_DETAIL
          ?.mapValue.fields?.STOID?.stringValue;

          if (UID === STOID) {
            user.push(usd)
          }
    }
  }

  const arrayWithDuplicates = user

const uniqueArray = arrayWithDuplicates.reduce((acc, curr) => {
  if (!acc.includes(curr)) {
    acc.push(curr);
  }
  return acc;
}, []);


  const { isMobile, isDeskTop } = useSelector((state) => state.animateSlice);
  return (
    <div
      className={` flex justify-start items-center ${
        isDeskTop && "p-2"
      } w-full h-full gap-10 `}
    >
      {isDeskTop && (
        <div className=" w-[20%]   justify-start items-start h-full flex flex-col gap-2 ">
          <div className=" w-full h-[65px] flex justify-between p-2 items-center ">
            <div
              onClick={() => {
                dispatch(setViewStory(false)), dispatch(setStoryId(0));
              }}
              className=" cursor-pointer bg-[#333333] rounded-full p-1 "
            >
              <Icon path={mdiWindowClose} size={1} />
            </div>

            <p className=" text-2xl font-medium tracking-wider ">Stories</p>
          </div>

          {!isMobile && (
            <div className=" w-[100%] h-auto flex flex-col gap-2 ">
              {
                uniqueArray?.map((d) => {
                  const data = d;

                  const STID = USER_STORYS?.filter((ust) => {
                    const STOID =
                      ust?._document?.data.value.mapValue.fields
                        ?.STORY_OWNER_DETAIL?.mapValue.fields?.STOID
                        ?.stringValue;
                    return STOID === data?.UID;

                  });

                  return (
                    <UserCard
                      STID={STID[STID?.length -1]?.id}
                      data={d}
                      key={
                        d?.UID
                          
                      }
                      UID={
                        d?.UID
                      }
                    />
                  );
                })}
            </div>
          )}
        </div>
      )}

      <div
        style={{
          width: isDeskTop ? "70%" : "100%",
          padding: isDeskTop ? "0" : 0,
        }}
        className=" flex justify-start items-center  h-full p-0   "
      >

         <ViewStoryCard userData={uniqueArray} />
      </div>
    </div>
  );
};

export default ViewStory;
