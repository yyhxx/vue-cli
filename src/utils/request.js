import { getCookie, setCookie } from "@/utils/tools";
import router from "@/router";

import axios from "axios";
const service = axios.create();
service.defaults.baseURL = process.env.API_ROOT;
service.defaults.headers.post["Content-Type"] = "application/json";

let lastConfig = null
    // 添加请求拦截器
service.interceptors.request.use(
    function(config) {
        // 在发送请求之前做些什么
        config.headers['Client-Type'] = 'web'

        if (config.url.indexOf('login') === -1) {
            config.headers['Authorization'] = getCookie('Authorization')
        }
        lastConfig = config
        return config;
    },
    function(error) {
        // 对请求错误做些什么
        console.log(error);
        return Promise.reject(error);
    }
);

// 添加响应拦截器
service.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        if (response.data.rc === 1001) {
            setCookie('Authorization', 'Base ' + response.data.data)
            return service(lastConfig)
        }
        return response;
    },
    error => {
        // 对响应错误做点什么
        console.log(error.response.status);
        switch (error.response.status) {
            case 401:
                router.replace({
                    path: "/user/login",
                    query: { target: router.currentRoute.fullPath }
                });
                break;
            case 404:
                // router.push('/error/404');
                break;
            case 500:
                // return Promise.reject(error)
        }
    }
);

export default service;