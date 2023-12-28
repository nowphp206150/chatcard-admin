<script setup>
import { ref, toRefs } from 'vue';
import { useUser } from '../store/useUser';
import { NAvatar, useMessage } from 'naive-ui';
import { PencilSharp } from '@vicons/ionicons5';
import { template } from 'lodash';
import useAxios from '../utils/useAxios';
import axios from 'axios';

const {
    username,
    picture,
    intro
} = toRefs(useUser())
const introduce = ref(intro.value)
const message = useMessage()

defineExpose({ introduce })

const changePicture = (file)=>{
    axios.post('http://127.0.0.1:9999/upload', {name: '12', file:file}).then(res=>{
        console.log(res)
    }) 
}

const beforeUpload = async (data) => {
        if (data.file.file?.type !== "image/png") {
          message.error("只能上传png格式的图片文件，请重新上传");
          return false;
        }
        return true;
      }

//   48|DCtmK8yRDOf2TQgDE68iIyLB2aM1r7rIcUoh4sr7


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
                    class="flex items-center"
                    method = 'GET'
                    action="http://127.0.0.1:9999/upload"
                    :headers="{
                        Authorization: '48|DCtmK8yRDOf2TQgDE68iIyLB2aM1r7rIcUoh4sr7', 
                        Accept: 'application/json', 
                        'Content-Type':'multipart/form-data',
                        }"
                    @error="changePicture"
                    >
                    <n-icon :component="PencilSharp"></n-icon>
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