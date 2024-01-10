<script setup>
import { onMounted, toRefs, h, reactive, ref, watch } from 'vue'
import { useRouter, RouterView } from 'vue-router'
import { useUser } from '../store/useUser'
import { useMessage, NIcon, NAvatar, NText } from 'naive-ui'
import {
    Pencil as EditIcon,
    LogOutOutline as LogoutIcon,
    BookmarkOutline,
    ChevronDownSharp,
    PeopleOutline,
    KeyOutline
} from "@vicons/ionicons5";
import updateProfile from './updateProfile.vue';

const router = useRouter()
const store = useUser()
const message = useMessage()
const {
    username,
    token,
    picture,
    intro
} = toRefs(store)


onMounted(() => {
    if (username.value === null || token.value === null) {
        message.warning('请登录后访问')
        router.push({
            name: 'login'
        })
    }
})


// header
const showProfileModel = ref(false)
const sonProfile = ref(null)

const changeIntro = () => {
    intro.value = sonProfile.value.introduce
    message.success('更新成功')
    showProfileModel.value = false
}

const logout = () => {
    username.value = null
    token.value = null
    router.push({
        name: 'login'
    })
    message.success('注销成功，请重新登录')
}

const renderIcon = (icon) => {
    return () => {
        return h(NIcon, null, {
            default: () => h(icon)
        });
    };
};

const handleSelect = (key) => {
    if (key === "logout") logout();
    else if (key === "edit") showProfileModel.value = true;
}

const options = reactive([
    {
        key: 'header',
        type: 'render',
        render: () => {
            return h(
                "div",
                {
                    style: "display: flex; align-items: center; padding: 8px 12px;"
                },
                [
                    h(NAvatar, {
                        round: true,
                        style: "margin-right: 12px;",
                        src: picture.value
                    }),
                    h("div", null, [
                        h("div", null, [h(NText, { depth: 2 }, { default: () => username.value })]),
                        h("div", { style: "font-size: 12px;" }, [
                            h(
                                NText,
                                {
                                    depth: 3,
                                    width: 1
                                },
                                { default: () => intro.value }
                            )
                        ])
                    ])
                ]
            );
        }
    },
    {
        label: "编辑用户资料",
        key: "edit",
        icon: renderIcon(EditIcon)
    },
    {
        label: "退出登录",
        key: "logout",
        icon: renderIcon(LogoutIcon)
    }
])

// sider

const menuOptions = [
    {
        label: "用户管理",
        key: "users",
    },
    {
        label: "key管理",
        key: "keys",
        children: [
            {
                label: "key查询",
                key: "key_search"
            }
        ]
    },
];

const collapsed = ref(false)
const renderMenuLabel = (option) => {
    return h(
        "div",
        { href: option.href, target: "_blank", class: 'text-base' },
        option.label
    );
    return option.label;
}
const renderMenuIcon = (option) => {
    if (option.key === "users")
        return h(NIcon, null, { default: () => h(PeopleOutline) });;
    if (option.key === "keys" || option.key === 'key_search')
        return h(NIcon, null, { default: () => h(KeyOutline) });
    return h(NIcon, null, { default: () => h(BookmarkOutline) });
}
const expandIcon = () => {
    return h(NIcon, null, { default: () => h(ChevronDownSharp) });
}

const handleSelectContent = (key, item) => {
    if (key === 'users') router.push({ name: 'user' })
    else if (key === 'key_search') router.push({ name: 'key' })
}

</script>

<template>
    <div class="flex flex-col h-full w-full">
        <div class="flex justify-between items-center h-14 pl-6 pr-12 shadow-md">
            <div class=" text-lg">GPT管理系统</div>
            <div class="flex items-center space-x-3">
                <n-dropdown :options="options" placement="bottom-start" @select="handleSelect">
                    <NAvatar :bordered="true" :round="true" :src="picture" :size="'large'">
                    </NAvatar>
                </n-dropdown>
            </div>
        </div>
        <div class="flex flex-auto overflow-auto">
            <div class="h-full border border-solid shadow-md pt-10">
                <n-layout-sider collapse-mode="width" :collapsed-width="64" :width="180" :collapsed="collapsed" show-trigger
                    @collapse="collapsed = true" @expand="collapsed = false">
                    <n-menu class=" space-y-4" :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="30"
                        :icon-size="28" :root-indent="28" :indent="18" :options="menuOptions"
                        :render-label="renderMenuLabel" :render-icon="renderMenuIcon" :expand-icon="expandIcon"
                        @update:value="handleSelectContent" />
                </n-layout-sider>
            </div>
            <div class=" p-4 flex w-full h-full justify-center items-center">
                <div class="w-full h-full flex flex-col items-center border border-solid border-gray shadow-md rounded-lg">
                    <RouterView></RouterView>
                </div>
            </div>
        </div>
    </div>
    <n-modal v-model:show="showProfileModel" preset="card" :show-icon="false"
        style="width: 500px; margin-left: calc(50%-250px); top: -100px;">
        <updateProfile ref="sonProfile"></updateProfile>
        <div class="flex justify-center">
            <div class="flex justify-end w-2/3 space-x-2">
                <n-button @click="showProfileModel = false">取消</n-button>
                <n-button type="success" @click="changeIntro">确认</n-button>
            </div>
        </div>
    </n-modal>
</template>
