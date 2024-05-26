import { collection, collectionGroup, doc, getDocs } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import { useDispatch } from "react-redux";
import { addAdmin } from "../authSlice";

const GetAdminData = async () => {

    const uid = localStorage.getItem('adminId')
  const data = await getDocs(collection(firestore, `/users/`));

  const content = data?.docs
    ?.filter((d) => d.id === uid)[0]._document.data.value.mapValue.fields

  return content;
};

export default GetAdminData;
