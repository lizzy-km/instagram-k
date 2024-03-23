import { useDispatch } from "react-redux";
import { blurOn } from "../../redux/services/animateSlice";

export default function useCreatePostFun() {
  const dispatch = useDispatch();
  const createPost = () => {
    dispatch(blurOn(true));
  };

  return { createPost };
}
