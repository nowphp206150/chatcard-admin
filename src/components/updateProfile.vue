<script setup>
import { ref, toRefs } from 'vue';
import { useUser } from '../store/useUser';
import { NAvatar, useMessage } from 'naive-ui';
import { PencilSharp } from '@vicons/ionicons5';
import { template } from 'lodash';
import useAxios from '../utils/useAxios';
import { baseURL } from '../utils/useAxios';
import axios from 'axios';

const {
    username,
    picture,
    intro,
    token
} = toRefs(useUser())
const introduce = ref(intro.value)
const message = useMessage()
const header = ref({Authorization: token.value})
console.log(baseURL)

defineExpose({ introduce })

const beforeUpload = (file)=>{
    console.log(file.file.file.type)
    if(file.file.file.type != "image/png" && file.file.file.type != "image/jpg"){
        message.warning("请上传图片")
        return false
    }
}

const uploadRef = ref(null)

const finishUpload = (file)=>{
    var res = JSON.parse(file.event.target.response)
    console.log(res)
    uploadRef.value.clear()
    if (res.Code === 1){
        message.warning("图片上传失败")
        return 
    }
    picture.value = "data:image/png;base64," + res.Result.avatar
    message.success("图片上传成功")
}

</script>

<template>
    <div class="flex flex-col w-full pb-2 items-center space-y-4">
        <n-badge type="warning" :offset="[-17, 100]" :size="20">
            <n-avatar 
                :bordered="true"
                :size="120"
                :round = "true" 
                :src="picture"
                >
            </n-avatar>
            <template #value>
                <n-upload
                    ref="uploadRef"
                    class="flex items-center"
                    method = 'POST'
                    :action='baseURL+"/v1/user/uploadavatar"'
                    :headers="header"
                    :show-cancel-button = "false"
                    :show-remove-button ="false"
                    :show-retry-button = "false"
                    :show-file-list = "false"
                    :max="1"
                    :keep-file-after-finish="false"
                    @before-upload="beforeUpload"
                    @finish="finishUpload"
                    @error="()=>{uploadRef.value.clear()}"
                    >
                    <n-icon :component="PencilSharp" class="hover:cursor-pointer"></n-icon>
                </n-upload>
            </template>
        </n-badge>
        <div class="flex flex-col w-2/3 space-y-1">
            <div class="text-base pl-1">用户名</div>
            <n-input v-model:value="username" :readonly="true" type="text" placeholder="用户名" />
        </div>
        <div class="flex flex-col w-2/3 space-y-1">
            <div class="text-base pl-1">简介</div>
            <n-input
                v-model:value="introduce"
                type="textarea"
                placeholder="简介"
            />
        </div>
    </div>
</template>