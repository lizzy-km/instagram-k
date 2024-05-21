import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import { addPost, addUserData } from "../authSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const GetData = async( colName='empty' ) => {
    const data =    await getDocs(collection(firestore, `${colName}`))

        const content = data?.docs
          ?.map((d) => d._document)
          .map(({ data }) => data.value.mapValue.fields.data.arrayValue.values)
          .map((mapValue) => mapValue)
          .flatMap((d) => d)
          .flatMap(({ mapValue }) => mapValue.fields);
    


        return (content)
};

export default GetData;
