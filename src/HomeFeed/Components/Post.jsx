import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { firestore } from "../../firebase/firebase";
import PostCard from "./PostCard";
import { collection, getDocs } from "firebase/firestore";

const Post = ({ filter = "" }) => {
  const { isMobile } = useSelector((state) => state.animateSlice);

  const { updateFeed } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const [USER_POSTS, setUSER_POSTS] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function User_post() {
      setIsLoading(true);

      await getDocs(collection(firestore, "/USER_POSTS"))
        .then((data) => setUSER_POSTS(data))
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));
    }
    User_post();
  }, []);

  useEffect(() => {
    // refresh data on Something changes in data (add/remove)
    async function User_post() {
      setIsLoading(true);

      await getDocs(collection(firestore, "/USER_POSTS"))
        .then((data) => setUSER_POSTS(data))
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));
    }
    User_post();
  }, [updateFeed]);

  const acnUP = USER_POSTS?.docs?.sort((prev, curr) => {
    // view posts data depend on it's uploaded date
    const currTime =
      +curr?._document.data?.value.mapValue.fields.UPLOADED_AT?.integerValue;
    const prevTime =
      +prev?._document.data?.value.mapValue.fields.UPLOADED_AT?.integerValue;

    return currTime - prevTime;
  });

  const filterByUID = acnUP?.filter((d) => {
    const data = d?._document.data?.value.mapValue.fields;
    const UID = data?.POST_OWNER_DETAIL.mapValue.fields.POID.stringValue;

    return UID === filter;
  });

  console.log(filter);
  

  const Post = filter?.user  ? filterByUID : acnUP;

  if (isLoading === true) {
    return <></>;
  }

  return (
    <div
      style={{
        width: isMobile ? "100%" : "80%",
      }}
      className="flex flex-col gap-8 w-[70%] self-center  p-2 my-2 h-auto  rounded-md"
    >
      {Post?.map((d) => {
        const data = d._document.data.value.mapValue.fields;
        const PID = data?.PID.stringValue;
        const PON = data?.POST_OWNER_DETAIL.mapValue.fields.PON.stringValue;

        return <PostCard data={data} name={PON} key={PID} />;
      })}
    </div>
  );
};

export default Post;
