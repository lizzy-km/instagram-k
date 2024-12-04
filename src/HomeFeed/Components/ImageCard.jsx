import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ImageCard = ({ PID, url }) => {
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
    <div className=" w-full h-full ">
      {isLoading === true ? (
        <img           src="https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/vecteezy_placeholder-image-default-set-for-the-website_.jpg?alt=media&token=25df6d22-ec04-4c60-b31b-6d74b953610e"
        className=" invert-none cursor-pointer h-full   bg-[#242526] rounded-xl   snap-center transition-all   object-cover object-top  "
        />
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
