import { toRefs } from 'vue';
import axios from 'axios';
import router from '../router/index';
import { useUser } from '../store/useUser';

export const baseURL = "http://127.0.0.1:5201"

const useAxios = axios.create({
    baseURL: baseURL,
    timeout: 10000
})

useAxios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const store = useUser();
    const {
        token,
    } = toRefs(store);
    if (token.value) {
        config.headers.Authorization = token.value;
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

useAxios.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    router.push({
        name: 'login'
    })
    return Promise.reject(error);
});

export default useAxios;