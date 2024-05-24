import { collection, doc, getDocs } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { addUserData } from "../authSlice";
import { useEffect, useState } from "react";

export default async function GetData(colName = "empty") {
  const dispatch = useDispatch()
  const data = await getDocs(collection(firestore, colName))



  const content = data?.docs
    ?.map((d) => d)
    ?.map((d) => d._document)
    ?.map(({ data }) => data?.value?.mapValue?.fields);

   


  return   content;
}
