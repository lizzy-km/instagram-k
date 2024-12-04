import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ImageCard = ({ PID, url }) => {
  const [isLoading, setIsLoading] = useState(true);

  function getImageSize(imageLink) {
    setIsLoading(true);

    Promise.all(imageLink)
      .then((data) => {
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    getImageSize(url);
  }, []);

  const { isMobile } = useSelector((state) => state.animateSlice);
  return (
    <div className=" w-full h-full ">
      {isLoading === true ? (
        <div className=" invert-none cursor-pointer h-[350px] w-[400px]   bg-[#24252657] rounded-xl   snap-center transition-all   object-cover object-top  "></div>
      ) : (
        <img
          src={url}
          key={PID + "_" + url}
          id="imgW"
          style={{
            width: isMobile ? "100%" : "100%",
          }}
          className=" invert-none cursor-pointer h-full   bg-[#242526] rounded-xl   snap-center transition-all   object-cover object-top  "
          alt=""
          srcset=""
        />
      )}
    </div>
  );
};

export default ImageCard;
