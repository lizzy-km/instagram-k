import { getDownloadURL, listAll, ref } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { storage } from "../../firebase/firebase";
import { setImageList } from "../../redux/services/authSlice";
const USDATA = async({pd,name,UID,data}) => {

    const dispatch = useDispatch();



        async function postUrlGen(path) {
            let u = [];
            path?.map(
              async (ddd) =>
                await getDownloadURL(ref(storage, ddd.fullPath)).then((data) => {
                  u.push(data);
                  dispatch(setImageList({ url: u, name: name, UID: UID }));
                })
            );
          }
      
          const storageRef = ref(
            storage,
            `user_photo/${data?.UID?.stringValue}/${
              hasPf &&
              data?.profile_picture?.arrayValue?.values[0]?.mapValue?.fields?.PFID
                ?.stringValue
            }`
          );
      
          const postRef = ref(
            storage,
            `user_post/${data?.UID?.stringValue}/${
              hasPostD && pd?.mapValue?.fields?.PID?.stringValue
            }`
          );
      
          await listAll(storageRef).then((data) => {
            imgUrl(data?.items[0]?.fullPath);
          });
      
          await listAll(postRef).then((data) => postUrlGen(data.items));
      
          const imgUrl = async (path) => {
            const urls = await getDownloadURL(ref(storage, path));
            dispatch(setImageList({ userProfile: urls }));
          };
 
}

export default USDATA
