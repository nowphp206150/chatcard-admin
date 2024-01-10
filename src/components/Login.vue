<script setup>
import { ref, reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import useAxios from '../utils/useAxios';
import { useMessage } from 'naive-ui';
import { useUser } from '../store/useUser';

const formRef = ref(null);
const user = reactive({
    username: '',
    password: ''
})
const message = useMessage()
const router  = useRouter()
const store = useUser()

const {
    username,
    token,
    picture
} = toRefs(store)

const login = ()=>{
    useAxios.post('/v1/login', JSON.stringify({
        username: user.username,
        password: user.password
    })).then(response=>{
        console.log(response.data)
        if(response.data.Code !== 0){
            message.error('用户名或密码错误')
            return 
        }
        username.value = user.username
        token.value = response.headers.token
        if(response.data.Result.avatar !== ""){
            picture.value = "data:image/png;base64," + response.data.Result.avatar
        }
        router.push({
            name: 'header'
        })
        message.success('登录成功')
    })
}

const rules = {
    username: [
    {
        required: true,
        validator(rule, value) {
            if(!value) return new Error("请输入用户名");
            return true;
        },
        trigger: ["input", "blur"]
    }
    ],
    password: [
    {
        required: true,
        validator(rule, value) {
            if(!value) return new Error("请输入密码");
            return true;
        },
        trigger: ["input", "blur"]
    }
    ]
};

</script>

<template>
    <div class="flex h-screen w-full items-center justify-center backdrop-blur-lg">
        <n-form ref="formRef" :model="user" :rules="rules" class="flex flex-col justify-center items-center w-80 h-80 rounded-lg shadow-md relative bottom-20">
            <div class="text-3xl">欢迎</div>
            <n-form-item path="username" size="large" class="w-3/4">
                <n-input v-model:value="user.username" @keydown.enter.prevent class=" bg-gray-400 focus:bg-white rounded-md w-full pl-1" placeholder="用户名"/>
            </n-form-item>
            <n-form-item path="password" size="large" class="w-3/4 -mt-5">
                <n-input v-model:value="user.password" autocomplete="current-password" type="password" @keydown.enter.prevent class="bg-gray-100 focus:bg-white rounded-md w-full pl-1" placeholder="密码"/>
            </n-form-item>
            <button @click="login" class=" bg-sky-500 active:opacity-50 hover:bg-sky-400 w-3/4 h-10 rounded-md text-white text-lg">登录</button>
        </n-form>
    </div>
</template>