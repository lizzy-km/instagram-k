import React from "react";
import { useSelector } from "react-redux";
import DataCard from "./DataCard";

const GetData = () => {
  const { UserData } = useSelector(
    (deserializedState) => deserializedState.authSlice
  );
  return (
    <div>
      {UserData?.map((d) => {
        const name =
          d?._document.data.value.mapValue.fields?.user_name.stringValue;
        const data = d?._document.data.value.mapValue.fields;
        return <DataCard data={data} name={name} key={d.id} />;
      })}
    </div>
  );
};

export default GetData;
