import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CustomModal from "./CustomModal";
import { ONECOMMERCE_LOGIN_URL, IDENTITY_MODULE_BASE_URL} from "../../utils/url";

import { _POST } from "../../services/axios.method";

let refreshTokenTimeout;
const TOKEN_REFRESH_MARGIN = 5 * 60 * 1000; // 5 minutes before expiry

export default function AuthManager() {
    const location = useLocation(); // Get the current route
    const [idToken, setIdToken] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        console.log("Current pathname:", location.pathname);
        const storedIdToken = localStorage.getItem("id_token");
        const storedAccessToken = localStorage.getItem("access_token");
        const storedRefreshToken = localStorage.getItem("refresh_token");
        const storedUserName = localStorage.getItem("name");
        setIdToken(storedIdToken);
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setUserName(storedUserName);


        if (location.pathname !== "/login" && storedIdToken && storedAccessToken && storedRefreshToken) {
          console.log("Running function because pathname is NOT /login");
          console.log(idToken,accessToken,refreshToken)
          scheduleTokenRefresh(accessToken,refreshToken)
        } else {
          console.log("User is on the login page");
        }
      }, [location.pathname]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [refreshTokenData] = useState(null);

  function decodeToken(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  }
  

  function scheduleTokenRefresh(accessToken, refreshToken) {
    console.log('dsddsdd')
    if (!accessToken || !refreshToken) return;
  
    const decoded = decodeToken(accessToken);
    console.log('decoded',decoded.exp)
    if (!decoded || !decoded.exp) return;
    console.log('decodeddecoded',decoded)
    const expiresAt = decoded.exp * 1000; // Convert to milliseconds
    const refreshAt = expiresAt - TOKEN_REFRESH_MARGIN;
    const delay = refreshAt - Date.now();
    console.log('delaydelay',delay)
    if (delay > 0) {
        clearTimeout(refreshTokenTimeout);
        refreshTokenTimeout = setTimeout(handleOpenPopup, delay, refreshToken);
        // refreshTokenTimeout = setTimeout(handleOpenPopup, 5000, refreshToken);
    }
  }

  async function handleOpenPopup() {
    try {
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error refreshing token:", error);
      logout();
    }
  }

  async function handleRefreshTokens() {
    try {
      const payload = {
        refresh_token: refreshToken,
        username:userName
      };
      
      const response = await _POST(`${IDENTITY_MODULE_BASE_URL}user/refreshToken`, payload, 
      {
        headers: {
          idtoken:idToken
        },
      }
    );
    const data = response?.data || null;
    console.log('datadata',data?.data?.id_token)
       if (!data || !data?.isSuccess) {
        console.log('errr')
         logout();
       }
       
       const newAccessToken = data?.data?.access_token;
       const newIdToken = data?.data?.id_token;
       localStorage.setItem("id_token",newIdToken);
      localStorage.setItem("access_token",newAccessToken);

       console.log("Token refreshed successfully");
       setIsModalOpen(false)
       scheduleTokenRefresh(newAccessToken, refreshToken);
       
      return response?.data?.data ?? [];
    } catch (error) {
      return [];
    }
  }

  function logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = ONECOMMERCE_LOGIN_URL;
  }

  return (
    <CustomModal
      isOpen={isModalOpen}
      onClose={logout}
      onConfirm={handleRefreshTokens}
    />
  );
}
