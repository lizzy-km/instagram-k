import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogin, setUpdateFeed } from "../redux/services/authSlice";

import { auth, storage } from "../firebase/firebase";
import addData from "../redux/services/Hooks/AddData";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import GetAdminData from "../redux/services/Hooks/GetAdminData";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Spin } from "antd";
import UpdateData from "../redux/services/Hooks/UpdateData";

const Login = () => {
  const [loginState, setLoginState] = useState(true);
  const { UserData, Story, admin, adminProfile, userAvatar, updateFeed } =
    useSelector((deserializedState) => deserializedState.authSlice);

  const { isTablet, isMobile, isDeskTop } = useSelector(
    (state) => state.animateSlice
  );
  const dispatch = useDispatch();

  const [passAlert, setPassalert] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isUserExist] = useState(false);

  const SignUp = async (data) => {
    setIsLoading(true);

    const name = data.name;
    const email = data.email;
    const password = data.password;

    function getFirstChars(name) {
      if (!name) return []; // Handle empty string case

      const words = name?.split(" ");
      const firstChars = [];
      for (const word of words) {
        firstChars.push(word[0]);
      }
      return firstChars;
    }

    const firstCharacters = getFirstChars(name);

    const nick =
      firstCharacters.length > 0
        ? firstCharacters?.reduce((prev, curr) => prev + curr)
        : null;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      let imageUrl = "";
      let profile = [];
      if (profileImage) {
        const fileSize = profileImage?.size;
        const PFID = nick + "PF" + fileSize;
        const uid = user.uid;

        const path = `user_photo/${user.uid}/${PFID}/${profileImage.name}`;

        const storageRef = ref(storage, path);
        const uploadTask = await uploadBytesResumable(storageRef, profileImage);
        imageUrl = await getDownloadURL(uploadTask.ref);

        profile = [
          {
            PFID,
            PFPATH: imageUrl,
            isImage: true,
            uploaded_at: Date.now(),
          },
        ];
        addData("users", email, uid, name);

        const Data = {
          PFID: nick + "PF" + `${fileSize}`,
          isImage: true,
          PFPATH: imageUrl,
        };

        const Datal = {
          PFID: nick + "PF" + `${fileSize}`,
          isImage: true,
          PFPATH: imageUrl,
        };

        UpdateData("profile", uid, "USID", Data, Datal);

        // Update user's display name and photo
        await updateProfile(user, {
          displayName: name,
          photoURL: imageUrl,
        })
          .then((data) => console.log("data"))
          .catch((error) => console.log(error));

        await signInWithEmailAndPassword(auth, email, password);
        const getAdmin = [GetAdminData("users", name)];

        Promise.all(getAdmin)
          .then(() => {
            setIsLoading(false);
            dispatch(setUpdateFeed(true));
          })
          .catch((error) => console.log(error));
        window.location.reload(true);
        dispatch(setLogin(true));
        setLoginState(true);
      }

      setIsLoading(false);
    } catch {
      setIsLoading(false);

      toast.error("Signup Failed!");
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const SignIn = async (data) => {
    setIsLoading(true);

    const user_name = data.user_name;
    const email = data.email;
    const password = data.password;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Login successful, navigate or handle user

      const user = userCredential.user;

      const getAdmin = [GetAdminData("users", user_name)];

      await UpdateData("status", user.uid, "pid", 'online', "");



      Promise.all(getAdmin)
        .then((data) => {
          setIsLoading(false);
          dispatch(setUpdateFeed(true));

        })
        .catch((error) => console.log(error));
      window.location.reload(true);
      dispatch(setLogin(true));
    } catch (error) {
      setIsLoading(false);
      toast.error("Login Failed");
      console.log(error.message);
    }
  };

  const validatePassword = (password) => {
    const validations = [
      {
        test: (pw) => pw.length >= 8,
        message: "*At least 8 characters long.\n ",
      },
      {
        test: (pw) => /[A-Z]/.test(pw),
        message: "*At least one uppercase letter.\n ",
      },
      {
        test: (pw) => /[a-z]/.test(pw),
        message: "*At least one lowercase letter.\n ",
      },
      { test: (pw) => /[0-9]/.test(pw), message: "*At least one number.\n " },
      {
        test: (pw) => /[@$!%*?&#]/.test(pw),
        message:
          "*At least one special character\n (@, $, !, %, *, ?, &, #).\n",
      },
    ];

    return validations
      .filter(({ test }) => !test(password))
      .map(({ message }) => [message]);
  };

  const PwTyping = (e) => {
    const newPw = e.target.value;
    setPassalert(validatePassword(newPw));
  };

  const onSubmit = async (data) => {
    loginState === false ? SignUp(data) : SignIn(data);
  };

  const ProfilePictureSelected = (e) => {
    const imgSrc = e.target.files[0];
    setProfileImage(imgSrc);
    if (imgSrc) {
      const url = URL.createObjectURL(imgSrc);
      setImageSrc(url);
    }
  };

  return (
    <div className=" flex relative flex-col justify-center items-center w-full h-screen ">
      <h1 className="text-2xl font-bold text-center mb-4">
        {loginState === false ? "Sign up with Queed" : "Login with Queed"}
      </h1>

      <div
        className={` ${
          isDeskTop
            ? "flex"
            : "flex-col  overflow-auto max-h-screen gap-1 pb-1  justify-start items-start "
        }  w-full  gap-5 justify-center bg-[#212121] items-center h-screen`}
      >
        {loginState === false && (
          <div
            className={`${
              isDeskTop ? "w-[30%] h-full " : "w-[100%] h-[30%] "
            }" flex flex-col   justify-start items-center gap-2 "`}
          >
            <p className="block text-lg tracking-wide p-2 font-medium text-gray-300">
              Select profile picture
            </p>
            <div className={ ` ${isDeskTop ? 'h-[250px] w-[250px] ' :' h-[70px] w-[70px] ' } " invert-none flex rounded-md justify-center items-center rounded-full  p-1 "`}>
              <img
                className=" object-cover bg-center w-full h-full rounded-full  rounded w-auto "
                src={imageSrc ? imageSrc : userAvatar}
                alt=""
                srcset=""
              />
            </div>
            <div className=" flex p-2 justify-between items-center gap-2 ">
              <div className=" relative p-1 bg-blue-600 rounded px-2 font-medium flex justify-center items-center ">
                <p> Choose Photo </p>
                <input
                  className=" absolute top-[-20%] w-full left-2 opacity-0  "
                  type="file"
                  accept="image/*"
                  onChange={(e) => ProfilePictureSelected(e)}
                  required
                />
              </div>

              <div
                onClick={() => setImageSrc(false)}
                className=" relative cursor-pointer p-1 bg-blue-900 rounded px-2 font-medium flex justify-center items-center "
              >
                <p> Remove Photo </p>
              </div>
            </div>
          </div>
        )}
        <div
          className={` ${
            isDeskTop ? "w-[30%]" : "w-[90%] h-[50%] p-2 "
          } " h-full  p-4 bg-[#212121] rounded-lg shadow-md"`}
        >
          <form className="  " onSubmit={handleSubmit(onSubmit)}>
            {!loginState && (
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Name
                </label>
                <input
                  {...register("name", { required: true })}
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 bg-[#333333] rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
                {errors.name && (
                  <span className=" flex p-2  italic text-red-600 ">
                    {errors.name.message}
                  </span>
                )}
              </div>
            )}

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>

              <input
                {...register("email", { required: true })}
                type="email"
                id="email"
                className="w-full px-3 py-2 bg-[#333333] rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
              {errors.email && (
                <span className=" flex p-2  italic text-red-600 ">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="mb-6 flex wrap flex-col flex w-full ">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>

              <input
                {...register("password", { required: true })}
                type="password"
                id="password"
                min="8"
                onChange={(e) => PwTyping(e)}
                className="w-full px-3 py-2 bg-[#333333] rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
              {!loginState && (
                <pre className=" flex p-2 invert-none rc-textarea-affix-wrapper flex-wrap max-w-full w-full  italic text-red-600 ">
                  {passAlert}
                </pre>
              )}

              {errors.password && (
                <span className=" flex p-2  italic text-red-600 ">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between mb-4"></div>

            {loginState ? (
              <button
                disabled={isLoading && true}
                type="submit"
                className="w-full px-3 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? <Spin /> : "Login "}
              </button>
            ) : isUserExist ? (
              <div
                disabled={isLoading && true}
                className="w-full px-3 py-2 cursor-not-allowed rounded-lg flex justify-center items-center bg-blue-900 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <p>Signup</p>
              </div>
            ) : (
              <button
                disabled={isLoading && true}
                type="submit"
                className="w-full px-3 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? <Spin /> : "SignUp "}
              </button>
            )}

            <div className="text-center flex justify-center mt-4">
              <span className="text-sm text-gray-200">
                {!loginState
                  ? "Already have an account?"
                  : "You don't have any account?"}
              </span>

              {loginState === true ? (
                <button
                  onClick={() => setLoginState(false)}
                  className="text-sm cursor-pointer text-blue-600 hover:underline ml-1"
                >
                  Sign up
                </button>
              ) : (
                <button
                  onClick={() => setLoginState(true)}
                  className="text-sm cursor-pointer text-blue-600 hover:underline ml-1"
                >
                  Login
                </button>
              )}
            </div>
          </form>
          <div className="w-full h-[5%] "></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
