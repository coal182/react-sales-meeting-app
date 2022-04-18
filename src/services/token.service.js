import Cookies from 'js-cookie';

const getLocalRefreshToken = () => {
    let userString = Cookies.get('user');
    if(typeof userString === "undefined"){
        userString = null
    }
    const user = JSON.parse(userString);
    return user?.refresh_token;
};
const getLocalAccessToken = () => {
    let userString = Cookies.get('user');
    if(typeof userString === "undefined"){
        userString = null
    }
    const user = JSON.parse(userString);
    return user?.token;
};
const updateLocalAccessToken = (token) => {
    let userString = Cookies.get('user');
    if(typeof userString === "undefined"){
        userString = null
    }
    let user = JSON.parse(userString);
    user.token = token;
    Cookies.set("user", JSON.stringify(user));
};
const getUser = () => {
    let userString = Cookies.get('user');
    if(typeof userString === "undefined"){
        userString = null
    }
    return JSON.parse(userString);
};
const setUser = (user) => {
    console.log(JSON.stringify(user));
    Cookies.set("user", JSON.stringify(user));
};
const removeUser = () => {
    Cookies.remove("user");
};

const TokenService = {
    getLocalRefreshToken,
    getLocalAccessToken,
    updateLocalAccessToken,
    getUser,
    setUser,
    removeUser,
};
export default TokenService;
