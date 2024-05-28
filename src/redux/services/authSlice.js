import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  user: null,
  token: null,
  viewImage: null,
  viewStoryImage: null,
  isLogin:true,
  element:null,
  UserData:[],
  Post:[],
  Story:[],
  admin:[],
  adminProfile:[],
  hasNewStory:false,
  storyId:0,
  userId:0,
  userAvatar:'https://firebasestorage.googleapis.com/v0/b/look-vince.appspot.com/o/assets%2Fe8d7d05f392d9c2cf0285ce928fb9f4a.jpeg?alt=media&token=43dffced-a38e-40cf-9387-6a7071e40baa'
  // friend:[]
};

const STORAGE_KEY = 'Auth';

//____________________________________________________storedItems_____________________Null_____//
const storedItems = Cookies.get(STORAGE_KEY) ? JSON.parse(Cookies.get(STORAGE_KEY)) : null;

if (storedItems) {

  initialState.isLogin = storedItems;
  

}

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    addUser: (state, { payload }) => {
      (state.user = payload.user), (state.token = payload.token);
      Cookies.set(STORAGE_KEY, JSON.stringify(state.user));
      Cookies.set("token", JSON.stringify(state.token));
    },
    addViewImage: (state, { payload }) => {
      state.viewImage = payload;
    },
    addStoryImage: (state, { payload }) => {
      state.viewStoryImage = payload;
    },
    setLogin: (state,{payload})=> {
      state.isLogin = payload
      Cookies.set(STORAGE_KEY, JSON.stringify(state.isLogin));

    },
    addElement: (state, { payload }) => {
      state.element = payload;
    },
    addUserData: (state, { payload }) => {
      state.UserData = payload;
    },
    addPost: (state, { payload }) => {
      state.Post = payload;
    },
    addStory: (state, { payload }) => {
      state.Story = payload;
    },
    addAdmin:(state, { payload })=>{
      state.admin = payload

    },
    addAdminProfile : (state, { payload }) => {
      state.adminProfile = payload
    },
    
    setNotHasNewStory: (state, { payload })=> {
      state.hasNewStory = false

    },
    setHasNewStory: (state, { payload })=> {
      state.hasNewStory = true

      setTimeout(setNotHasNewStory(),700)
    },
    setStoryId:(state, { payload })=> {
      state.storyId = payload
    },
    setUserId:(state, { payload })=> {
      state.userId = payload
    }
    
  },
});

export const { userId,setUserId, storyId,setStoryId, setNotHasNewStory, addUser, addFriend, addViewImage, addStoryImage,setLogin,addElement,element,addUserData,UserData,addPost,Post,addStory,Story,addAdmin,admin,addAdminProfile,adminProfile,setHasNewStory,hasNewStory } =
  authSlice.actions;
export default authSlice.reducer;
