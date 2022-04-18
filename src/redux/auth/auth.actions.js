import { authActionTypes } from "./auth.types";
import { messageActionTypes } from "../message/message.types";
import AuthService from "../../services/auth.service";
  
export const login = (username, password) => (dispatch) => {
    return AuthService.login(username, password).then(
      (data) => {
        dispatch({
          type: authActionTypes.LOGIN_SUCCESS,
          payload: { user: data },
        });
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        dispatch({
          type: authActionTypes.LOGIN_FAIL,
        });
        dispatch({
          type: messageActionTypes.SET_MESSAGE,
          payload: message,
        });
        return Promise.reject();
      }
    );
};

export const logout = () => (dispatch) => {
    AuthService.logout();
    dispatch({
      type: authActionTypes.LOGOUT,
    });
};

export const refreshToken = (accessToken) => (dispatch) => {
    dispatch({
      type: authActionTypes.REFRESH_TOKEN,
      payload: accessToken,
    })
  }