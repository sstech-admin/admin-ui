import axios from "axios";
import { storeData } from "..";
import { logoutUser } from "../slices/thunk";
// import { api } from "../config";

// axios.defaults.baseURL = "https://api-node.themesbrand.website";
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;
// axios.defaults.baseURL = "http://65.0.91.122:8080/dharmaInfosystem";
// axios.defaults.baseURL = "http://192.168.29.234:8080";
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

// content type
const authUser = sessionStorage.getItem("authUser");
const token = JSON.parse(authUser) ? JSON.parse(authUser).token : null;
if (token) axios.defaults.headers.common["Authorization"] = "Bearer " + token;

axios.interceptors.request.use(
  (config) => {
    const authUser = sessionStorage.getItem("authUser");
    // const refreshToken = JSON.parse(
    //   sessionStorage.getItem("authUser")
    // )?.refreshToken;
    const token = JSON.parse(authUser) ? JSON.parse(authUser).token : null;
    config.headers.Authorization = token ? `Bearer ${token}` : `Bearer `;
    return config;
  },
  (error) => {
    console.log("error: ", error);
    Promise.reject(error);
  }
);
async function refreshToken() {
  await axios
    .post("/refreshToken", {
      refreshToken: JSON.parse(sessionStorage.getItem("authUser"))
        ?.refreshToken,
    })
    .then((resp) => {
      const authUser = JSON.parse(sessionStorage.getItem("authUser"));
      console.log("authUser . then condition: ", authUser);
      const updatedData = {
        ...authUser,
        token: resp.data.jwtToken,
        jwtToken: resp.data.jwtToken,
      };
      sessionStorage.setItem("authUser", JSON.stringify(updatedData));
      return resp.data.jwtToken;
    })
    .catch(async () => {
      // Refresh token failed, redirect to login and log out user
      Promise.reject("Session expired");
      storeData.dispatch(logoutUser());
      sessionStorage.removeItem("authUser");
      window.location.href = "/login";
    });
}
// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    // response?.status !== 200 && storeData.dispatch(logoutUser());
    return response.data ? response.data : response;
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    const originalRequest = error.config;
    switch (error.status) {
      case 500:
        break;
      case 401:
        const newAccessToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      case 404:
        break;
      default:
        break;
    }
    // if (error.status !== 200) {
    //   storeData.dispatch(logoutUser());
    // }
    return Promise.reject(error);
  }
);
/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {
  /**
   * Fetches data from given url
   */

  //  get = (url, params) => {
  //   return axios.get(url, params);
  // };
  get = (url, params) => {
    let response;

    let paramKeys = [];

    if (params) {
      Object.keys(params).map((key) => {
        paramKeys.push(key + "=" + params[key]);
        return paramKeys;
      });

      const queryString =
        paramKeys && paramKeys.length ? paramKeys.join("&") : "";
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }

    return response;
  };
  /**
   * post given data to url
   */
  create = (url, data) => {
    return axios.post(url, data);
  };

  // getData = (url, data) => {
  //   results = axios.post(url, data);
  // };

  createMedia = (url, data) => {
    return axios.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };
  /**
   * Updates data
   */
  update = (url, data) => {
    return axios.patch(url, data);
  };

  put = (url, data) => {
    return axios.put(url, data);
  };
  /**
   * Delete
   */
  delete = (url, data) => {
    return axios.delete(url, data);
  };
}
const getLoggedinUser = () => {
  const user = sessionStorage.getItem("authUser");
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

export { APIClient, setAuthorization, getLoggedinUser };