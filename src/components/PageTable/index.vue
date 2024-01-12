<template>
    <n-card class="page-card-content" :bordered="false">
        <div class="table-header-content">
            <!-- 按钮组 -->
            <div class="header-title">
                <n-space>
                    <n-button type="info" @click="emit('onAdd')" size="small" v-if="props.add" v-permission="props.permission">
                        <template #icon>
                            <n-icon>
                                <Add />
                            </n-icon>
                        </template>
                        新增
                    </n-button>
                    <slot name="left"></slot>
                </n-space>
            </div>
            <div class="header-toolbar">
                <n-space>
                    <slot name="right"></slot>
                    <n-tooltip trigger="hover">
                        <template #trigger>
                            <div class="table-toolbar-right-icon" @click="emit('onRefresh')">
                                <n-icon size="18">
                                    <Reload />
                                </n-icon>
                            </div>
                        </template>
                        <span>刷新</span>
                    </n-tooltip>
                    <!--密度-->
                    <n-tooltip trigger="hover">
                        <template #trigger>
                            <div class="table-toolbar-right-icon">
                                <n-dropdown trigger="click" :options="densityOptions" v-model:value="tableSize"
                                    @select="handleSize">
                                    <n-icon size="18">
                                        <FunnelOutline />
                                    </n-icon>
                                </n-dropdown>
                            </div>
                        </template>
                        <span>密度</span>
                    </n-tooltip>
                    <ColumsSetting v-model:list="columns"></ColumsSetting>
                </n-space>
            </div>
        </div>
        <!-- 表格 -->
        <n-data-table :loading="props.loading" :columns="columns" :data="props.data" :size="tableSize" :bordered="false"
            :pagination="props.pagination ? pagination : false" remote :row-key="(row) => row.id"
            :max-height="tableMaxHeight" :scroll-x="800" @update:checked-row-keys="handleCheckRow" />
    </n-card>
</template>
<script setup>
import ColumsSetting from "./ColumsSetting/index.vue"
import { ref, onMounted, computed, toRaw, unref } from "vue"
import { useWindowSize } from '@vueuse/core'

const tableMaxHeight = ref(0)
onMounted(() => {
    computeTableHeight();
})

function computeTableHeight() {
    const headerH = 64;
    const pageHead = document.querySelector(".page-header");// 获取pageHead元素高度
    const pageheadH = pageHead?.clientHeight;
    const containerHeight = useWindowSize().height // 获取浏览器窗口高度
    tableMaxHeight.value = containerHeight.value - headerH - pageheadH - 34 - 28 - 150 // 计算表格最大高度
};
const emit = defineEmits(["onAdd", "onRefresh", "onUpdatePage", "onCheckRow"])
const props = defineProps({
    add: {
        type: Boolean,
        default: true
    },
    loading: {
        type: Boolean,
        default: false
    },
    data: {
        type: Array,
        default: []
    },
    columns: {
        type: Array,
        default: []
    },
    pagination: {
        type: Boolean,
        default: false
    },
    pageProps: {
        type: Object,
        default: () => { return { page: 1, pageSize: 10, total: 10 } }
    },
    permission:{
        type: Object,
        default:()=>{}
    }
})
const paginationRech = computed(() => {
    return {
        page: props.pageProps.page,
        pageSize: props.pageProps.pageSize,
        itemCount: props.pageProps.total,
        showSizePicker: true,
        prefix({ total = props.pageProps.total }) {
            return `共 ${total} 条`
        },
        onChange: (page) => {
            pagination.page = page;
            emit("onUpdatePage", { page: pagination.page, pageSize: pagination.pageSize })
        },
        onUpdatePageSize: (pageSize) => {
            pagination.pageSize = pageSize;
            emit("onUpdatePage", { page: pagination.page, pageSize: pagination.pageSize })
        },
        pageSizes: [
            { label: '10/页', value: 10 },
            { label: '20/页', value: 20 },
            { label: '30/页', value: 30 },
            { label: '50/页', value: 50 },
            { label: '80/页', value: 80 },
            { label: '100/页', value: 100 }
        ]
    }
})
const pagination = computed(() => toRaw(unref(paginationRech)))
const columns = ref(props.columns);
const tableSize = ref('medium');
const densityOptions = [
    {
        type: 'menu',
        label: '紧凑',
        key: 'small',
    },
    {
        type: 'menu',
        label: '默认',
        key: 'medium',
    },
    {
        type: 'menu',
        label: '宽松',
        key: 'large',
    },
];


const handleSize = (key) => {
    tableSize.value = key;
}
const handleCheckRow = (row) => {
    emit('onCheckRow', row[0])
}
</script>
<style lang="scss" scoped>
@import"./table.scss"
</style>
