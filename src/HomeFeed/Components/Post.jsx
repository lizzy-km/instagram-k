import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { firestore } from "../../firebase/firebase";
import PostCard from "./PostCard";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

const Post = ({ filter = "" ,position='feed'}) => {
  const { isMobile } = useSelector((state) => state.animateSlice);

  const { updateFeed } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const [isLoading, setIsLoading] = useState(true);

   const userRf = collection(firestore, "USER_POSTS");
    const userQuery = query(userRf,orderBy("UPLOADED_AT"));
    const [TUser] = useCollectionData(userQuery, { idField: "id" });

  useEffect(() => {
    async function User_post() {
      setIsLoading(true);

      await getDocs(collection(firestore, "/USER_POSTS"))
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
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));
    }
    User_post();
  }, [updateFeed]);

  


  const filterByUID = TUser?.filter((d) => {
    const data = d;
    const UID = data?.POST_OWNER_DETAIL?.POID;

    return UID === filter;
  });

  

  const Post = filter?.length > 10  ? filterByUID : TUser;

  if (isLoading === true) {
    return <></>;
  }

  return (
    <div
      style={{
        width: isMobile ? "100%" : position ==='user'? "80%" :'95%',
      }}
      className="flex flex-col gap-8  self-center  p-2 my-2 h-auto  rounded-md"
    >
      {Post?.reverse()?.map((d) => {
        const data = d;
        const PID = data?.PID;
        const PON = data?.POST_OWNER_DETAIL.PON;

        return <PostCard data={data} name={PON} key={PID} />;
      })}
    </div>
  );
};

export default Post;
