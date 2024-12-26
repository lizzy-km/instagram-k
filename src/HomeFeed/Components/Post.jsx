import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { firestore } from "../../firebase/firebase";
import PostCard from "./PostCard";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

const Post = ({ filter = "", position = "feed" }) => {
  const { isMobile, postLimit } = useSelector((state) => state.animateSlice);

  const { updateFeed } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );

  const [isLoading, setIsLoading] = useState(false);
  const userRf = collection(firestore, "USER_POSTS");
  const userQuery = query(
    userRf,
    orderBy("UPLOADED_AT", "desc")
  );
  const [TUser] = useCollectionData(userQuery, { idField: "id" });

  const up = localStorage.getItem("posts");

  const UserPost = up?.length > 10 ? JSON.parse(up) : [];

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

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(TUser));

  }, [postLimit]);

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(TUser));
  }, []);


  const filterByUID = TUser?.filter((d) => {
    const data = d;
    const UID = data?.POST_OWNER_DETAIL?.POID;

    return UID === filter;
  });

  const Post = filter?.length > 10 ? filterByUID : TUser;



  return (
    <div
      style={{
        width: isMobile ? "100%" : position === "user" ? "80%" : "95%",
      }}
      className="flex flex-col gap-[50px]  self-center  p-2 my-2 h-auto  rounded-md"
    >
      {Post?.length > 0 &&
        Post?.map((d) => {
          const data = d;
          const PID = data?.PID;
          const PON = data?.POST_OWNER_DETAIL?.PON;

          return <PostCard data={data} name={PON} key={PID} />;
        })}
    </div>
  );
};

export default Post;
