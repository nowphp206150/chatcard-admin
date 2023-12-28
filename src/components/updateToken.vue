<script setup>
import { ref, defineProps, onMounted, h } from 'vue';
import useAxios from '../utils/useAxios';
import { NButton, NInputNumber, NPopconfirm, useMessage } from 'naive-ui';

const props = defineProps({
    updateToken: Object
})

const message = useMessage()
const tokens = ref([])
const tokenTable = ref([])

onMounted(()=>{
    getTokens();
})

const getTokens = ()=>{
    useAxios.post('/v1/user/getbyid', JSON.stringify({
        id: props.updateToken.id
    })).then(response=>{
        const th=tokenTable.value
        tokens.value = response.data.Result.data.Tokens
        if(tokens.value){
            Promise.all(tokens.value.map(getTokenDetail)).then(response=>{
                tokenTable.value = response
                for(let i=0; i<tokenTable.value.length; ++i){
                    tokenTable.value[i]['CreateTime'] = formatTime(tokenTable.value[i]['CreateTime'])
                    tokenTable.value[i]['UpdateTime'] = formatTime(tokenTable.value[i]['UpdateTime'])
                    tokenTable.value[i]['ShowNumber'] = false
                    for(let j=0; j<th.length; ++j){
                        if(tokenTable.value[i].Key === th[j].Key && th[j].ShowNumber === true){
                            tokenTable.value[i]['ShowNumber'] = th[j].ShowNumber;
                            tokenTable.value[i]['Number'] = th[j].Number;
                            break
                        }
                    }
                }
            })
        }
    })
}

const getTokenDetail = async (key) => {
    try{
        const response = await useAxios.post('/v1/token/getbykey', JSON.stringify({
            'key': key
        }))
        if(response.data.Code !== 0){
            return null;
        }
        return response.data.Result.data;
    }catch(error){
        console.log(error);
        return null;
    }
}

const deleteKey = (key)=>{
    useAxios.post('/v1/token/delete', JSON.stringify({
        key: key
    })).then(response=>{
        if(response.data.Code !== 0){
            message.error('删除失败')
            return
        }
        getTokens();
        message.success('删除成功')
    })
}

const createKey = ()=>{
    useAxios.post('/v1/token/create', JSON.stringify({
        id: props.updateToken.id
    })).then(response=>{
        if(response.data.Code !== 0){
            message.warning('创建失败')
            return 
        }
        getTokens();
        message.success('创建成功')
    })
}

function formatTime(timestamp) {
  const date = new Date(timestamp * 1000); // 将时间戳转换为毫秒
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


const createColumns = ({
  edit,
  del
}) => {
  return [
    {
      title: "Key",
      key: "Key",
      align: 'center'
    },
    {
      title: "余额",
      key: "Number",
      align: 'center',
      render(row){
        return h(
            'div',
            {
                class: 'flex justify-center items-center'
            },
            [
                h(
                    'div',
                    {
                        style: { width: '90px', height: '34px', display: row.ShowNumber?'none':'flex'},
                        class: 'justify-center items-center'
                    },
                    {
                        default: () => row.Number
                    }
                ),
                h(
                    NInputNumber,
                    {   
                        style: {width: '90px', display: row.ShowNumber?'block':'none'},
                        value: row.Number,
                        onUpdateValue: (value)=>{
                            row.Number = value
                        }
                    }
                )
            ]
        )
      }
    },
    {
      title: "创建时间",
      key: "CreateTime",
      align: 'center'
    },
    {
      title: "更新时间",
      key: "UpdateTime",
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
                class: 'flex'
            },
            [
                h(
                    NButton,
                    {
                        size: "small",
                        onClick: () => { row.ShowNumber = !row.ShowNumber; row.Number = 0; },
                        style: { display: row.ShowNumber?'none':'block'}
                    },
                    { default: () => "编辑" }
                ),
                h(
                    NButton,
                    {
                        size: "small",
                        onClick: () => edit(row),
                        style: {display: row.ShowNumber?'block': 'none'}
                    },
                    { default: () => "修改" }
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
                            type: "error",
                            style: { 'margin-left': '8px'},
                            },
                            { default: () => "删除" }
                        )
                        },
                        default: () => {
                        return '确认删除该Key？'
                        }
                    }
                )
            ]
        )
      }
    }
  ];
};

const columns = createColumns({
    edit(row){
        row.ShowNumber = !row.ShowNumber
        useAxios.post('/v1/token/updatenumber', JSON.stringify({
            key: row.Key,
            number: row.Number
        })).then(response=>{
            getTokens()
            if(response.data.Code !== 0){
                message.error('余额更新失败')
                return 
            }
            message.success('更新成功')
        })
    },
    del(row){
        deleteKey(row.Key);
    }
})

</script>

<template>
    <div class="w-full">
        <n-data-table
            :columns="columns"
            :data="tokenTable"
            :bordered="false"
        />
        <div class="flex pt-4">
            <n-button type="primary" @click="createKey">新建</n-button>
        </div>
    </div>
</template>