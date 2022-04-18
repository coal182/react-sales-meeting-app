import { authActionTypes } from "./auth.types";
import TokenService from "../../services/token.service";

const user = TokenService.getUser();

const initialState = user
    ? { isLoggedIn: true, user }
    : { isLoggedIn: false, user: null };

export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {      
        case authActionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                user: payload.user,
            };
        case authActionTypes.LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                user: null,
            };
        case authActionTypes.LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                user: null,
            };
        case authActionTypes.REFRESH_TOKEN:
            return {
                ...state,
                user: { ...user, accessToken: payload },
            };
        default:
        return state;
    }
}