import axios from "axios";
import { STATUS_CODES } from "../utils/constants";
import { BASE_URL } from "../utils/url";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  validateStatus: function (status) {
    return status < STATUS_CODES.INTERNAL_ERROR;
  },
});

const errHandling = (error) => Promise.reject(error);

const reqHandling = async (config) => {
  const url = new URL(config.url, BASE_URL); // Ensure absolute URL
  const pathname = url.pathname.split("/").pop(); // Extract last segment
  const obj = { ...config };
  if (localStorage.getItem("token")) {
    const token =
      // localStorage.getItem("token") || sessionStorage.getItem("token");
      localStorage.getItem("id_token") || sessionStorage.getItem("id_token");

      const access_token = localStorage.getItem("access_token");
      // const client_id = localStorage.getItem("client_id");
    obj.headers.Authorization = access_token;
    // obj.headers.id_token = token;
    obj.headers.idtoken = token;
  }
  if(localStorage.getItem("active_client_project") && (pathname !== "getApplicationsNew") && (pathname !== "refreshToken")){
    const active_client_project=JSON.parse(localStorage.getItem("active_client_project")??"{}")
    obj.headers["X-DSM-Client-ID"] = active_client_project?.client_project_id;
    if(active_client_project?.isUseWidget){
      obj.headers["X-DSM-Client-WIDGET"] = active_client_project?.isUseWidget;
    }
    if(active_client_project?.client_project_es_id){
      obj.headers["X-DSM-Client-ES-ID"] = active_client_project?.client_project_es_id;
    }
    if(active_client_project?.cms_client_code){
      obj.headers["client-code"] = active_client_project?.cms_client_code;
      obj.headers["client-country"] = active_client_project?.cms_client_country??"";
    }
  }
  // if(localStorage.getItem("client_id")){
  //   obj.headers["clientId"] = localStorage.getItem("client_id");
  // }
   
  

  return obj;
};

const resHandling = (response) => response;
axiosInstance.interceptors.request.use(reqHandling, errHandling);
axiosInstance.interceptors.response.use(resHandling, errHandling);

export default axiosInstance;
