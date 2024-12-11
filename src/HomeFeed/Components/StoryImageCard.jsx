import { deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { firestore } from "../../firebase/firebase";
import {
  addAdmin,
  setStoryId,
  setUpdateFeed,
} from "../../redux/services/authSlice";
import { setViewStory } from "../../redux/services/animateSlice";
import Icon from "@mdi/react";
import { mdiTrashCanOutline } from "@mdi/js";
import GetAdminData from "../../redux/services/Hooks/GetAdminData";
const StoryImageCard = ({ PID, url, updateFeed, AID, UID, setMenu, menu }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { isMobile, isDeskTop } = useSelector((state) => state.animateSlice);


  const getAdmin = [GetAdminData()];

  const dispatch = useDispatch();
  useEffect(() => {
    function getImageSize(imageLink) {
      setIsLoading(true);

      Promise.all(imageLink)
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => console.log(error));
    }
    getImageSize(url);
  }, []);

  const deleteStory = async () => {

    const storyRef = doc(firestore, "/USER_STORYS", `/${PID}`);

      await deleteDoc(storyRef)
        .then((data) => {
          console.log(data);
          setMenu(false);
          dispatch(setViewStory(false))

          Promise.all(getAdmin)
            .then((data) => {
              console.log(data);

              dispatch(addAdmin(data[0]));
              dispatch(setUpdateFeed(!updateFeed));
              dispatch(setStoryId());
              !isDeskTop && dispatch(setViewStory(false));
            })
            .catch((error) => console.log(error))
        }

        )
        .catch((error) => console.log(error));
  };

  return (
    <div className="   min-w-full w-full flex-col  justify-center items-center py-0   h-full ">
      {AID === UID && (
        <div
          
          style={{
            display: menu ? "flex" : "none",
            right: isMobile ? "10px" : "10px",
          }}
          className=" text-sm p-2  w-[50%] gap-1 flex justify-start items-center  z-[99] top-[8%] right-[0%] backdrop-blur-sm bg-[#18181859] rounded absolute  "
        >
          {" "}
          <div onClick={deleteStory} className=" flex gap-2 hover:bg-[#18181857] px-2 rounded p-1 justify-start items-center " >
          <Icon onClick={deleteStory} path={mdiTrashCanOutline} size={0.6} />
          <p>Delete story</p>
          </div>
         
        </div>
      )}
      {isLoading === true ? (
        <img
          className=" invert-none cursor-pointer h-full  min-w-full  bg-[#24252657]    snap-center transition-all   object-cover object-top  "
          src="https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/vecteezy_placeholder-image-default-set-for-the-website_.jpg?alt=media&token=25df6d22-ec04-4c60-b31b-6d74b953610e"
          alt=""
          srcset=""
        />
      ) : (
        <img
          src={url}
          key={PID + "_" + url}
          id="imgW"
          style={{
            width: isMobile ? "100%" : "100%",
          }}
          className={`invert-none cursor-pointer h-full  min-w-full  bg-[#24252657] ${!isMobile ? 'rounded-2xl': ''}     snap-center transition-all   object-cover object-top `}  
          alt=""
          srcset=""
        />
      )}
    </div>
  );
};

export default StoryImageCard;
