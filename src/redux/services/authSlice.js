import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  user: null,
  token: null,
  viewImage: null,
  viewStoryImage: null,
  isLogin:[]
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

    }
  },
});

export const { addUser, addFriend, addViewImage, addStoryImage,setLogin } =
  authSlice.actions;
export default authSlice.reducer;
