import axiosInstance from "./api";
import TokenService from "./token.service";
import { refreshToken } from "../redux/auth/auth.actions";
const setup = (store) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      if (config.url != "/auth/refreshtoken") {
        const token = TokenService.getLocalAccessToken();
        if (token) {
          config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
          //config.headers["x-access-token"] = token; // for Node.js Express back-end
        }
      }else{
        const refresh_token = TokenService.getLocalRefreshToken();
        if (refresh_token) {
          config.headers["Authorization"] = 'Bearer ' + refresh_token;  // for Spring Boot back-end
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  const { dispatch } = store;
  axiosInstance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
      if (originalConfig.url !== "/auth/signin" && err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          try {
            console.log(TokenService.getLocalRefreshToken());
            console.log(TokenService.getLocalAccessToken());
            const rs = await axiosInstance.post("/auth/refreshtoken", {
              refresh_token: TokenService.getLocalRefreshToken(),
            });
            const { token } = rs.data;
            dispatch(refreshToken(token));
            TokenService.updateLocalAccessToken(token);
            return axiosInstance(originalConfig);
          } catch (_error) {
            return Promise.reject(_error);
          }
        }
      }
      return Promise.reject(err);
    }
  );
};
export default setup;