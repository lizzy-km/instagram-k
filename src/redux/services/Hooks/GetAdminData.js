import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import { useDispatch } from "react-redux";
import { addAdmin } from "../authSlice";

const GetAdminData = async (colName = "empty", uid) => {
  const data = await getDocs(collection(firestore, colName, `/${uid}/data`));

  const content = data?.docs
    ?.map((d) => d)
    ?.map((d) => d._document)
    ?.map(({ data }) => data?.value?.mapValue?.fields);

  
    localStorage.setItem("adminId", content[0]?.UID?.stringValue);

  return content;
};

export default GetAdminData;
