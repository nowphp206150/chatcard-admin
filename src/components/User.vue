<script setup>
import { ref, reactive, toRefs, onMounted, h, watch } from 'vue';
import { useUser } from '../store/useUser';
import { useMessage, NTag, NButton, NPopconfirm } from 'naive-ui';
import useAxios from '../utils/useAxios';
import { template } from 'lodash';
import updateUserVue from '../components/updateUser.vue';
import updateTokenVue from '../components/updateToken.vue';

const store = useUser()
const message = useMessage()

const users = ref([])
const page = ref(1)
const pageCount = ref(1)

const getUser = () => {
  useAxios.get('/v1/user/getuserlist', {
    params: {
      page: page.value
    }
  }).then(response => {
    // console.log('userList', response.data);
    users.value = response.data.Result.data
    pageCount.value = response.data.Result.totalPages
  }).catch(error => {
    console.log(error)
  })
}

onMounted(() => {
  getUser()
})

// User Table
watch(page, getUser)

const createColumns = ({
  del
}) => {
  return [
    {
      title: "ID",
      key: "id",
      align: 'center'
    },
    {
      title: "用户名",
      key: "name",
      align: 'center'
    },
    {
      title: "电话号码",
      key: "phone",
      align: 'center'
    },
    {
      title: "操作",
      key: "actions",
      align: 'center',
      render(row) {
        return h(
          "div",
          {
            class: "flex justify-center w-full h-full space-x-2"
          },
          [
            h(
              NPopconfirm,
              {
                positiveButtonProps: {
                  size: 'tiny',
                  bordered: true,
                  style: 'margin-right: 20px;'
                },
                negativeButtonProps: {
                  size: 'tiny',
                  bordered: true,
                  type: 'info',
                },
                showIcon: false,
                positiveText: 'Keys',
                negativeText: '用户',
                onPositiveClick: () => {
                  updateToken.value.id = row.id
                  showTokenModel.value = true
                },
                onNegativeClick: () => {
                  updateUser.value.id = row.id
                  updateUser.value.name = row.name
                  updateUser.value.phone = row.phone
                  showUserModel.value = true
                }
              },
              {
                trigger: () => {
                  return h(
                    NButton,
                    {
                      size: "small",
                    },
                    { default: () => "编辑" }
                  )
                },
                default: () => "选择管理什么内容？"
              }
            ),
            h(
              NPopconfirm,
              {
                positiveButtonProps: {
                  size: 'tiny',
                  class: 'bg-green-400',
                  style: 'margin-right: 30px;'
                },
                negativeButtonProps: {
                  size: 'tiny',
                  bordered: true,
                },
                positiveText: '确认',
                negativeText: '取消',
                onPositiveClick: () => {
                  del(row)
                }
              },
              {
                trigger: () => {
                  return h(
                    NButton,
                    {
                      size: "small",
                      type: "error"
                    },
                    { default: () => "删除" }
                  )
                },
                default: () => {
                  return '确认删除该用户？'
                }
              }
            )
          ]
        );
      }
    }
  ];
};

const columns = createColumns({
  del(rowData) {
    console.log(rowData)
    useAxios.post('/v1/user/delete', JSON.stringify({
      id: rowData.id
    })).then(response => {
      if (response.data.Code !== 0) {
        message.error('删除失败')
        return
      }
      getUser()
      message.success('删除成功')
    })
  }
})

const showUserModel = ref(false);
const updateUser = ref({
  id: '',
  name: '',
  phone: ''
})
const sonUser = ref(null)
const changeUser = () => {
  if (sonUser.value.newUser.name === null || sonUser.value.newUser.name === '') {
    message.warning('用户名不能为空')
    return
  }
  useAxios.post('/v1/user/update', JSON.stringify(sonUser.value.newUser)).then(response => {
    if (response.data.Code !== 0) {
      message.error('用户信息更新失败')
      return
    }
    getUser()
    showUserModel.value = false
    message.success('用户信息更新成功')
  })
}

const showTokenModel = ref(false)
const updateToken = ref({})


// New User
const showCreateUserModel = ref(false)
const newUser = ref({
  name: null,
  phone: null
})

const createUser = () => {
  if (newUser.value.name === null) {
    message.warning('用户名为必填项')
    return
  }
  useAxios.post('/v1/user/create', JSON.stringify(newUser.value)).then(response => {
    if (response.data.Code !== 0) {
      if (response.data.Result.message[0] === '用')
        message.error('用户已存在')
      else {
        message.error('电话号码不合规')
      }
      return
    }
    getUser();
    newUser.value = {
      name: null,
      phonw: null
    }
    showCreateUserModel.value = false
    message.success('用户创建成功')
  }).catch(error => {
    console.log(error)
  })
}

</script>

<template>
  <div class="flex flex-col items-center w-full h-full overflow-auto pt-4">
    <n-space vertical :size="12" class="w-full px-10">
      <n-data-table size="medium" :columns="columns" :data="users" />
      <div class="flex justify-between h-full w-full px-1">
        <NButton type="primary" @click="showCreateUserModel = true">新建用户</NButton>
        <n-pagination v-model:page="page" :page-count="pageCount" />
      </div>
    </n-space>
  </div>

  <!-- user -->
  <n-modal v-model:show="showUserModel" preset="card" :show-icon="false"
    style="width: 500px; margin-left: calc(50%-250px); top: -120px;">
    <template #header>
      <div>用户管理</div>
    </template>
    <updateUserVue :updateUser="updateUser" ref="sonUser"></updateUserVue>
    <div class="flex justify-end space-x-2 pt-2">
      <n-button @click="showUserModel = false">取消</n-button>
      <n-button type="success" @click="changeUser">修改</n-button>
    </div>
  </n-modal>

  <!-- tokens -->
  <n-modal v-model:show="showTokenModel" preset="card" :show-icon="false"
    style="width: 1200px; margin-left: calc(50%-600px); top:-120px;">
    <template #header>
      <div>Token管理</div>
    </template>
    <updateTokenVue :updateToken="updateToken"></updateTokenVue>
  </n-modal>

  <!-- create user -->
  <n-modal v-model:show="showCreateUserModel" preset="card" :show-icon="false"
    style="width: 500px; margin-left: calc(50%-250px); top: -120px;">
    <template #header>
      <div>用户创建</div>
    </template>
    <n-space vertical class="py-4 px-1 space-y-4">
      <div class="flex items-center">
        <div class="text-base w-1/4 text-center">用户名</div>
        <n-input v-model:value="newUser.name" type="text" placeholder="输入用户名" />
        <div class="text-lg text-red-500 ml-2">*</div>
      </div>
      <div class="flex items-center">
        <div class="text-base w-1/4 text-center">电话号码</div>
        <n-input v-model:value="newUser.phone" type="text" placeholder="+86" class="mr-4" />
      </div>
    </n-space>
    <div class="flex justify-end space-x-2 pt-2">
      <n-button @click="showCreateUserModel = false">取消</n-button>
      <n-button type="success" @click="createUser">创建</n-button>
    </div>
  </n-modal>
</template>