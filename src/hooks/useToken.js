import { useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

export default function useToken() {
    
    const getToken = () => {
        const tokenString = Cookies.get('token');
        if(typeof tokenString === "undefined"){
            return null
        }
        const userToken = JSON.parse(tokenString);
        return userToken
    };
    
    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        if(userToken==null){
            Cookies.remove('token');
            setToken("");
        }else{
            Cookies.set('token', JSON.stringify(userToken));
            setToken(userToken);
        }
        
    };

    // Add a request interceptor
    axios.interceptors.request.use(
        config => {
            if (token) {
                config.headers['Authorization'] = 'Bearer ' + token.token;
            }
            // config.headers['Content-Type'] = 'application/json';
            return config;
        },
        error => {
            Promise.reject(error)
        }
    );
    
    //Add a response interceptor

    let api_url = process.env.REACT_APP_API_URL;
    
    axios.interceptors.response.use((response) => {
        return response
    }, function (error) {
        const originalRequest = error.config;

        console.log(originalRequest.url);
        console.log(error.response.status);
    
        if (error.response.status === 401 && (originalRequest.url === api_url+`auth/signin` || originalRequest.url === api_url+`auth/refresh_token`)) {
            //router.push('/login');
            return Promise.reject(error);
        }
    
        if (error.response.status === 401 && !originalRequest._retry) {
    
            originalRequest._retry = true;
   
            return axios.post(api_url+'auth/refresh_token',{headers: {Authorization: "Bearer " + token.refresh_token}},
                {
                    "refresh_token": token.refresh_token
                })
                .then(res => {
                    if (res.status === 201) {
                        var new_token = token;
                        new_token.token = res.data.token;
                        setToken(new_token);
                        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token.token;
                        return axios(originalRequest);
                    }
                })
        }
        return Promise.reject(error);
    });

    return {
        setToken: saveToken,
        token
    }

}