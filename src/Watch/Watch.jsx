import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const Watch = () => {

  
  const navigate = useNavigate()

    useEffect(()=> {
        setTimeout( navigate('/'),1500)

    },[])
  return (
    <div className=" relative h-screen flex overflow-y-auto  pt-3 w-[40%] gap-3 flex-col justify-around items-start max-h-screen ">
     
    </div>
  );
};

export default Watch;
