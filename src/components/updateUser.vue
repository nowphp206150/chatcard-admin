<script setup>
import { defineProps, ref} from 'vue';

const props = defineProps({
    updateUser: Object
})

const newUser = ref(props.updateUser)
defineExpose({ newUser })

</script>

<template>
    <n-space vertical class="py-4 px-1 space-y-4">
        <div class="flex items-center">
            <div class="text-base w-1/4 text-center">ID</div>
            <n-input
                class="bg-gray-300 mr-4"
                v-model:value="newUser.id"
                type="text"
                :disabled="true"
            />
        </div>
        <div class="flex items-center">
            <div class="text-base w-1/4 text-center">用户名</div>
            <n-input
                v-model:value="newUser.name"
                type="text"
                placeholder="输入用户名"
            />
            <div class="text-lg text-red-500 ml-2">*</div>
        </div>
        <div class="flex items-center">
            <div class="text-base w-1/4 text-center">电话号码</div>
            <n-input
                v-model:value="newUser.phone"
                type="text"
                placeholder="+86"
                class="mr-4"
            />
        </div>
    </n-space>
</template>