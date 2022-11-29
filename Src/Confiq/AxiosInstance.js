import axios from 'axios';
import { otherStatus, rejection } from './Helper';

export const apiInstance = axios.create({
    baseURL: "https://saas-ecommerce.royaldonuts.xyz/api/",
    timeout: 5000,
    headers: {
        'Content-Type': "application/json",
        'Accept': "application/json",
        // 'Access-Control-Max-Age': 0
    }
})

apiInstance.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    console.log("error", error)
    return Promise.reject(error);
});

apiInstance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    console.log("error", error)
    otherStatus(error.response)
    return Promise.reject(error);
});




