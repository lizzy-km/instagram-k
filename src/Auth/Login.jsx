import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setLogin } from "../redux/services/authSlice";

import { auth } from "../firebase/firebase";
import addData from "../redux/services/Hooks/AddData";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import GetAdminData from "../redux/services/Hooks/GetAdminData";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Spin } from "antd";

const Login = () => {
  const [loginState, setLoginState] = useState(true);
  const dispatch = useDispatch();

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

    await createUserWithEmailAndPassword(auth, email, password)
      .then(function (user) {
        console.log("User registered successfully!", user);
        const uid = user.user.uid;
        console.log(uid);
        addData("users", email, uid, name);
        setIsLoading(false);
        toast.success("Signup successful");

        setLoginState(true);
      })
      .catch(function (error) {
        setIsLoading(false);
        toast.error("Signup Failed!");
      });
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
      console.log("User logged in:", userCredential);

      const getAdmin = [GetAdminData("users", user_name)];

      Promise.all(getAdmin)
        .then((data) => {
          setIsLoading(false);
          toast.success("Login successful");
          window.location.reload(true);
        })
        .catch((error) => console.log(error));

      dispatch(setLogin(true));
    } catch (error) {
      setIsLoading(false);
      toast.error("Login Failed");
      console.log(error.message);
    }
  };

  const onSubmit = async (data) => {
    loginState === false ? SignUp(data) : SignIn(data);
  };

  return (
    <div className=" flex relative flex-col justify-center items-center w-full h-screen ">
      <div className="flex w-full justify-center items-center h-screen bg-transparent">
        <div className="w-full max-w-md p-4 bg-[#212121] rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-4">
            {loginState === false
              ? "Sign up with Facebook"
              : "Login with Facebook"}
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
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
            <div className="mb-6">
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
                className="w-full px-3 py-2 bg-[#333333] rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
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
        </div>
      </div>
    </div>
  );
};

export default Login;
