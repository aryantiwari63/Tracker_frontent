/* eslint-disable no-console */
import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { _POST } from "../../services/axios.method";
import { cancelRequest } from "../../utils/helpers";
import { setToastMessageHandler } from "../../redux/action-creator/commonAction";
import { useDispatch } from "react-redux";
import Toast from "../common-components/toast";
import Spinner from "./Common/Spinner";

const CreatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [verified, setVerified] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const areAllKeysValid = (keys) => {
    return keys.every((key) => {
      const value = localStorage.getItem(key);
      return value !== null && value.trim() !== "";
    });
  };

  const keysToCheck = ["token", "client_id", "user_id"];

  useEffect(() => {
    const checkKeysAndFetchData = async () => {
      const allKeysValid = areAllKeysValid(keysToCheck);

      if (allKeysValid) {
        history.push("/dashboard");
      } else {
        localStorage.clear();

        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        if (token) {
          try {
            let response = await _POST(
              "/commonscreen/verify-request",
              {},
              {
                headers: {
                  authorization: token,
                },
              }
            );

            if (response.status === 200) {
              // console.log();
              setVerified(false);
            } else {
              setVerified(true);
            }
          } catch (e) {
            setVerified(true);
          }
        } else {
          setVerified(true);
        }
      }
    };

    // Call the async function
    checkKeysAndFetchData();
  }, [location.search]);

  const validatePassword = () => {
    let errors = {};
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!password) {
      errors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      errors.password =
        "Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validatePassword()) {
      try {
        setLoading(true);
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        // Handle password creation
        const ourRequest = await cancelRequest();
        const res = await _POST(
          `/commonscreen/createpassword`,
          {
            password,
          },
          {
            headers: {
              authorization: token,
            },
            cancelToken: ourRequest.token,
          }
        );

        if (res?.data?.status?.code === 200) {
          dispatch(setToastMessageHandler(res?.data?.data?.message, true));
          // setTimeout(() => {
          //   history.push("/");
          // }, 7000);
        } else {
          dispatch(setToastMessageHandler("Something went wrong", false));
        }
        setTimeout(() => {
          setLoading(false);
          history.push("/");
        }, 2000);
      } catch (error) {
        dispatch(setToastMessageHandler("Something went wrong", false));
        console.error(error, "testError");
        setTimeout(() => {
          setLoading(false);
          history.push("/");
        }, 2000);
      }
    }
  };

  if (verified) {
    return (
      <div
        className="h-screen flex items-center justify-center"
        style={{ width: "100%" }}
      >
        <div className="p-6 rounded-lg shadow-lg w-full max-w-md text-center bg-white">
          <h1 className="text-2xl font-bold mb-6">Access Denied</h1>
          <p>
            The session has expired, or you have already updated your password.
            Please contact support if you need further assistance.
          </p>
          <button
            type="login"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
            onClick={() => history.push("/")}
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className=" h-screen p-10"
        style={{ background: "#e6e8ec", width: "100%" }}
      >
        <Toast />
        <div
          className="loginpage__card flex items-stretch"
          style={{ marginTop: "5rem" }}
        >
          <div className="loginpage__leftpanel">
            <div className="">
              <div className="loginpage__ebuxlogo">
                <img src="assets/images/ebux-logo.png" />
              </div>
              <ul className="leftpanel__list">
                <li className="loginpage__items ">
                  Omni-Channel Media Optimisation
                </li>
                <li className="loginpage__items">Retail Data Integration</li>
                <li className="loginpage__items">Bulk Action Management</li>
                <li className="loginpage__items">Comprehensive Reporting</li>
              </ul>
            </div>
          </div>
          <div className="flex-1 justify-center flex">
            <div className=" justify-center flex">
              <div className="p-6 rounded-lg  w-full  bg-white">
                <h1 className="text-[1.875rem] font-semibold leading-9 my-6 text-center">
                  Create Password
                </h1>

                <form onSubmit={handleSubmit} className="flex gap-3">
                  <div className="" style={{ width: 150 }}>
                    {/* <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="password"
                  >
                    Password
                  </label> */}
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={` appearance-none border ${
                        errors.password ? "border-red-500" : ""
                      } rounded w-full py-2 px-3 text-gray-700 leading-tight  focus:shadow-outline border border-gray-300 mr-3 focus:border-blue-500 focus:outline-none`}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm  break-words">
                        *{errors.password}
                      </p>
                    )}
                  </div>

                  <div className="" style={{ width: 150 }}>
                    {/* <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label> */}
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={` appearance-none border ${
                        errors.confirmPassword ? "border-red-500" : ""
                      } rounded w-full py-2 px-3 text-gray-700 leading-tight  focus:shadow-outline border border-gray-300 mr-3 focus:border-blue-500 focus:outline-none`}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm  break-words">
                        *{errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div
                    className="flex  justify-center"
                    style={{ alignItems: "flex-start" }}
                  >
                    <button
                      type="submit"
                      className="flex bg-[#0081F7] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      disabled={loading}
                      style={{ cursor: loading ? "not-allowed" : "pointer" }}
                    >
                      {loading && <Spinner />} &nbsp;Create Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePassword;
