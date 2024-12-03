import React, { useEffect, useState } from "react";
import DataCard from "./DataCard";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import { useSelector } from "react-redux";

const GetData = () => {
 
 
  const [USER_POSTS, setUSER_POSTS] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function User_post() {
      setIsLoading(true);

      await getDocs(collection(firestore, "/USER_POSTS"))
        .then((data) => setUSER_POSTS(data?.docs))
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));
    }
    User_post();
  }, []);

  
  return (
    <div>
      {USER_POSTS?.map((d) => {
        
        const data = d?._document?.data?.value.mapValue.fields;
        return <DataCard data={data}  key={d.id} />;
      })}
    </div>
  );
};

export default GetData;
