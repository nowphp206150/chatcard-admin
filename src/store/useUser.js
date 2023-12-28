import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUser = defineStore('auther', ()=>{
    const username = ref(null);
    const token = ref(null);
    const picture = ref('https://07akioni.oss-cn-beijing.aliyuncs.com/demo1.JPG')
    const intro = ref('办公室最亮的星')
    return {
        username,
        token,
        picture,
        intro
    }
},{
    persist: true
})