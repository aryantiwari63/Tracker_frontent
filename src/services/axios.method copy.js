import { ONECOMMERCE_LOGIN_URL } from "../utils/url";
import Axios from "./axios.service";

export async function _GET2(url) {
  try {
    const response = await Axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return error;
  }
}
if (response.status === 401) {
  // localStorage.removeItem("token");
  localStorage.removeItem("id_token");
  localStorage.removeItem("access_token");
  localStorage.removeItem("token");
  window.location.href = ONECOMMERCE_LOGIN_URL;
  throw {
    error: response.statusText,
  };
}

export async function _GET(url) {
  try {
    const response = await Axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // if unverified token is provided, remove that token from the local storage
    if (response.status === 401) {
      // localStorage.removeItem("token");
      // redirect the user to the login page
      window.location.href = ONECOMMERCE_LOGIN_URL;
      throw {
        error: response.statusText,
      };
    }

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return error;
  }
}

export async function _GETWIthToken(url) {
  try {
      let id_token = localStorage.getItem("id_token");
    let client_id = localStorage.getItem("client_id");
    const response = await Axios.get(`${url}?clientId=${client_id}`, {
      headers: {
        "Content-Type": "application/json",
        idtoken : id_token  
      },  
    });

    // if unverified token is provided, remove that token from the local storage
    if (response.status === 401) {
      // localStorage.removeItem("im_token");
      // localStorage.removeItem("id_token");
      // localStorage.removeItem("token");
      // window.location.href = ONECOMMERCE_LOGIN_URL;
      throw {
        error: response.statusText,
      };
    }

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return error;
  }
}

export async function _POST(url, requestData, headers) {
  try {
    const response = await Axios.post(url, requestData, headers);
    if (response.status === 401) {
      // localStorage.removeItem("token");
      // localStorage.removeItem("im_token");
      // localStorage.removeItem("id_token");
      // window.location.href = ONECOMMERCE_LOGIN_URL;
      throw {
        error: response.statusText,
      };
    }
    return response;
  } catch (error) {
    return error;
  }
}

export async function _PATCH(url, requestData) {
  try {
    const response = await Axios.patch(url, requestData);
    if (response.status === 401) {
      // localStorage.removeItem("token");
      localStorage.removeItem("im_token");
      localStorage.removeItem("id_token");
      window.location.href = ONECOMMERCE_LOGIN_URL;
      throw {
        error: response.statusText,
      };
    }
    return response;
  } catch (error) {
    return error;
  }
}

export async function _DELETE(url) {
  try {
    const response = await Axios.delete(url);
    if (response.status === 401) {
      // localStorage.removeItem("token");
      localStorage.removeItem("im_token");
      localStorage.removeItem("id_token");
      window.location.href = ONECOMMERCE_LOGIN_URL;
      throw {
        error: response.statusText,
      };
    }
    return response;
  } catch (error) {
    return error;
  }
}