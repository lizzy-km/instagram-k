import { useEffect, useState } from "react";

const ImageCard = ({ PID, url,className }) => {
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

  const rounded = className?.rounded === 'rxl' ? ' rounded-xl ' : ''

  return (
    <div className=" w-full h-full ">
      {isLoading === true ? (
        <img
          src="https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/vecteezy_placeholder-image-default-set-for-the-website_.jpg?alt=media&token=25df6d22-ec04-4c60-b31b-6d74b953610e"
          className={` invert-none cursor-pointer h-full ${rounded}   bg-[#242526]   snap-center transition-all   object-cover object-top  `}
        />
      ) : (
        <img
          src={url}
          key={PID + "_" + url}
          id="imgW"
          
          className={` w-full  invert-none cursor-pointer h-full ${rounded}   bg-[#242526]   snap-center transition-all   object-cover object-top  `}
                    alt=""
          srcset=""
        />
      )}
    </div>
  );
};

export default ImageCard;
