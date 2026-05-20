import * as React from "react";
import { createContext, useState } from "react";
import { APPLICATION_ROUTES } from "../utils/constants";
import { useHistory, useLocation } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { getUserPermissions } from "../redux/action-creator/campaignAction";

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = (props) => {
  // const dispatch = useDispatch();
  const [authState, setAuthState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const history = useHistory();
  const { pathname } = useLocation();
  // console.log("text>>>>>>>>>>>>.",pathname)
  const refreshToken = (token) => {
    setAuthState(token);
    if (localStorage.getItem("token")) {
      localStorage.setItem("token", JSON.stringify(token));
    } else {
      sessionStorage.setItem("token", JSON.stringify(token));
    }
  };

  const onLogin = async (token, rememberMe, userName) => {
    try {
      console.log("onLogin", token);
      if (token) {
        if (rememberMe) {
          // localStorage.setItem("name", userName);
          localStorage.setItem("token", token);
        } else {
          localStorage.setItem("token", token);
          localStorage.setItem("name", userName);

          if (localStorage.getItem("credentials")) {
            localStorage.removeItem("credentials");
          }
        }
        console.log("APPLICATION_ROUTES.COMMONSCREEN", APPLICATION_ROUTES.COMMONSCREEN);
        setAuthState(token, userName);
        history.push(APPLICATION_ROUTES.COMMONSCREEN);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("persist:root");
    localStorage.removeItem("platforms");
    sessionStorage.removeItem("token");
    localStorage.clear();
    setAuthState(null);
    if (pathname !== "/createpassword") {
      history.push(APPLICATION_ROUTES.COMMONSCREEN);
    }
  };

  const checkLocalStorage = async () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      setAuthState(token);
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  React.useEffect(()=>{
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      // dispatch(getUserPermissions(role));
    }
  }, [localStorage.getItem("token"), localStorage.getItem("role")])

  const checkPlatform = async () => {
    const token = localStorage.getItem("platforms");
    if (token) {
      setLoading(false);
      return;
    }

   // onLogout();
    setLoading(false);
  };

  React.useEffect(() => {
    checkLocalStorage();
    checkPlatform();
  }, []);

  //   React.useEffect(() => {
  //     checkIfTokenExpired();
  //   }, [pathname]);

  return (
    <Provider
      value={{
        authData: authState,
        refreshToken,
        onLogin,
        authStateLoading: loading,
        setAuthState,
        onLogout,
        setAuthError,
        authError,
        authSuccess,
        setAuthSuccess,
      }}
      {...props}
    />
  );
};

export { AuthContext, AuthProvider };
