import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";

 const GetData = async (colName = "empty") => {
  const data = await getDocs(collection(firestore, `${colName}`));

  
  const content = data?.docs
    ?.map(d => d)?.map((d) => d._document)
    ?.map(({ data }) => data?.value?.mapValue?.fields)

  return content;
};

export default GetData;

