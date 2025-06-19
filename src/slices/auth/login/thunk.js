//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper";
import {
  postFakeLogin,
  postJwtLogin,
} from "../../../helpers/fakebackend_helper";

import {
  loginSuccess,
  logoutUserSuccess,
  apiError,
  reset_login_flag,
} from "./reducer";
import { notification } from "antd";

export const loginUser = (user, history) => async (dispatch) => {
  try {
    let response;
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      let fireBaseBackend = getFirebaseBackend();
      response = fireBaseBackend.loginUser(user.email, user.password);
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      response = await postJwtLogin({
        userName: user.email,
        password: user.password,
      });
      console.log("response: ", response);
    } else if (process.env.REACT_APP_DEFAULTAUTH) {
      response = postFakeLogin({
        email: user.email,
        password: user.password,
      });
    }

    var data = await response;
    console.log("data: ", data);

    if (data) {
      const token = !!data?.data?.token ? data?.data?.token : "";
      const updatedData = { ...data.data, token: token };
      sessionStorage.setItem("authUser", JSON.stringify(updatedData));
      // if (process.env.REACT_APP_DEFAULTAUTH === "other") {
      //   var finallogin = JSON.stringify(data);
      //   finallogin = JSON.parse(finallogin);
      //   data = finallogin.data;
      //   if (
      //     finallogin.status === "success" ||
      //     (finallogin.username && finallogin.password)
      //   ) {
      //     dispatch(loginSuccess(data));
      //     history("/dashboard");
      //   } else {
      //     history("/login");
      //     dispatch(apiError(finallogin));
      //   }
      // } else {
      dispatch(loginSuccess(updatedData));
      history("/dashboard");
      // }
    }
  } catch (error) {
    console.log("ER", error?.message);
    notification.error({
      message: "Error",
      description: error?.message || "User not found!",
      placement: "bottomRight",
    });
    dispatch(apiError(error));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    sessionStorage.removeItem("authUser");
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      let fireBaseBackend = getFirebaseBackend();
      const response = fireBaseBackend.logout;
      dispatch(logoutUserSuccess(response));
    } else {
      dispatch(logoutUserSuccess(true));
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const socialLogin = (type, history) => async (dispatch) => {
  try {
    let response;

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend();
      response = fireBaseBackend.socialLoginUser(type);
    }
    //  else {
    //   response = postSocialLogin(data);
    // }

    const socialdata = await response;
    if (socialdata) {
      sessionStorage.setItem("authUser", JSON.stringify(socialdata));
      dispatch(loginSuccess(socialdata));
      history("/dashboard");
    }
  } catch (error) {
    dispatch(apiError(error));
  }
};

export const resetLoginFlag = () => async (dispatch) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};
