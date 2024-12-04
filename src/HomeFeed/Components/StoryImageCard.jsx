import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const StoryImageCard = ({ PID, url }) => {
  const [isLoading, setIsLoading] = useState(true);

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

  const { isMobile } = useSelector((state) => state.animateSlice);
  return (
    <div className=" relative min-w-full w-full flex justify-center items-center py-0 px-2  h-full ">
      <img
        className=" invert absolute top-0 left-0 w-[150%] h-[150%] blur "
        src={url}
        alt=""
        srcset=""
      />
      <img
        src={url}
        key={PID + "_" + url}
        id="imgW"
        style={{
          width: isMobile ? "100%" : "100%",
        }}
        className=" invert-none cursor-pointer h-full  min-w-full  bg-[#24252657]    snap-center transition-all   object-cover object-top  "
        alt=""
        srcset=""
      />
    </div>
  );
};

export default StoryImageCard;
