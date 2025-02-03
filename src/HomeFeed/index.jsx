import { useDispatch, useSelector } from "react-redux";
import CreatePost from "./Components/CreatePost";
import Post from "./Components/Post";
import Story from "./Components/Story";
import GetAdminData from "../redux/services/Hooks/GetAdminData";
import { useEffect } from "react";
import { addAdmin } from "../redux/services/authSlice";

const HomeFeed = () => {
 
  const dispatch = useDispatch();

  const { admin } = useSelector((state) => state.authSlice);

  const getAdmin = [GetAdminData()];


  useEffect(() => {
    Promise.all(getAdmin)
      .then((data) => {
        dispatch(addAdmin(data[0]));
      })
      .catch((error) => console.log(error));
      document.title = "Queed | Newfeed"

  }, []);
  if (admin?.UID?.stringValue)
    return (
      <div
       
        className=" w-full md:w-[95%] lg:w-[35%] relative h-auto  overflow-hidden flex   bg-transparent mt-[80px]    p-0 w-[40%] gap-3 flex-col justify-start items-start  "
      >
        <Story />

        <div
         
          className=" w-full md:w-[80%] lg:w-[90%]   items-center h-auto  px-2 flex flex-col gap-6 "
        >
          <CreatePost />
          <Post />

          <div className=" w-full h-[60px] "></div>
        </div>
      </div>
    );
};

export default HomeFeed;
