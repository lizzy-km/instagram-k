import { useDispatch, useSelector } from "react-redux";
import LeftNav from "../Components/LeftNav";
import RightNav from "../Components/RightNav";
import CreatePost from "./Components/CreatePost";
import Post from "./Components/Post";
import Story from "./Components/Story";
import GetAdminData from "../redux/services/Hooks/GetAdminData";
import { useEffect } from "react";
import { addAdmin } from "../redux/services/authSlice";

const HomeFeed = () => {
  const { isTablet, isMobile, isDeskTop } = useSelector(
    (state) => state.animateSlice
  );
  const  dispatch = useDispatch()

  const { admin } = useSelector(
    (state) => state.authSlice
  );



  const getAdmin = [GetAdminData()];

  useEffect(()=> {
    Promise.all(getAdmin)
              .then((data) =>{
                dispatch(addAdmin(data[0]))}
            )
              .catch((error) => console.log(error))

  },[])
  if(admin?.UID?.stringValue) return (
    <div
      style={{
        width: isMobile
          ? "100%"
          : isTablet
          ? "95%"
          : isDeskTop
          ? "40%"
          : "100%",
      }}
      className=" relative h-auto flex  bg-transparent    p-0 w-[40%] gap-3 flex-col justify-start items-start  "
    >
      
      <Story />
      <div
        style={{
          width: isMobile
            ? "100%"
            : isTablet
            ? "90%"
            : isDeskTop
            ? "100%"
            : "100%",
        }}
        className="  w-full h-auto top-[270px] flex flex-col gap-6 "
      >
        <CreatePost />
        <Post />

        <div className=" w-full h-[200px] " >

        </div>
      </div>
    </div>
  );
};

export default HomeFeed;
