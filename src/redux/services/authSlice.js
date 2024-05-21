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
  Story:[]
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
    
  },
});

export const { addUser, addFriend, addViewImage, addStoryImage,setLogin,addElement,element,addUserData,UserData,addPost,Post,addStory,Story } =
  authSlice.actions;
export default authSlice.reducer;
