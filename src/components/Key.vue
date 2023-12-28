<script setup>
import { ref, onMounted, h, watch } from 'vue';
import { NButton, NPopconfirm, NInputNumber, useMessage } from 'naive-ui';
import useAxios from '../utils/useAxios';

onMounted(()=>{
    getKeys()
})

const tokens = ref([])
const message = useMessage()
const page = ref(1)
const pageTotal = ref(1)

const getKeys = ()=>{
    useAxios.get('/v1/token/gettokenlist', {
        params: {
            page: page.value
        }
    }).then(response=>{
        const th = tokens.value
        tokens.value = response.data.Result.data
        pageTotal.value = response.data.Result.totalPages
        for(let i=0; i<tokens.value.length; ++i){
            tokens.value[i]['UpdateTime'] = formatTime(tokens.value[i]['UpdateTime'])
            tokens.value[i]['CreateTime'] = formatTime(tokens.value[i]['CreateTime'])
            tokens.value[i]['ShowNumber'] = false
            for(let j=0; j<th.length; ++j){
                if(th[j].Key === tokens.value[i].Key && th[j].ShowNumber === true){
                    tokens.value[i]['ShowNumber'] = th[j].ShowNumber
                    tokens.value[i]['Number'] = th[j].Number
                    break;
                }
            }
        }
    })
}

const deleteKey = (key)=>{
    useAxios.post('/v1/token/delete', JSON.stringify({
        key: key
    })).then(response=>{
        if(response.data.Code !== 0){
            message.error('删除失败')
            return
        }
        getKeys();
        message.success('删除成功')
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
            'div',
            {
                class: 'flex justify-center',
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
        );
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
            getKeys()
            if(response.data.Code !== 0){
                message.error('余额更新失败')
                return 
            }
            message.success('更新成功')
        })
    },
    del(row){
        console.log(row)
        deleteKey(row.Key);
    }
})

watch(page, getKeys)


</script>

<template>
    <div class="flex flex-col items-center w-full h-full pt-4 px-10 overflow-auto">
        <n-data-table
            size="medium"
            :columns="columns"
            :data="tokens"
            :bordered="true"
        />
        <div class="flex justify-end w-full">
            <n-pagination v-model:page="page" :page-count="pageTotal" />
        </div>
    </div>
</template>