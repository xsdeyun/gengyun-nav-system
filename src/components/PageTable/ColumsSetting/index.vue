<template>
    <n-tooltip trigger="hover">
        <template #trigger>
            <div class="cursor-pointer table-toolbar-right-icon">
                <n-popover trigger="click" :width="230" class="toolbar-popover" placement="bottom-end">
                    <template #trigger>
                        <n-icon size="18">
                            <SettingsOutline />
                        </n-icon>
                    </template>
                    <template #header>
                        <div class="table-toolbar-inner-popover-title">
                            <n-space style="justify-content: space-between;">
                                <n-checkbox v-model:checked="checkAll" @update:checked="onCheckAll">列展示</n-checkbox>
                                <n-button text type="info" size="small" class="mt-1" @click="resetColumns">重置</n-button>
                            </n-space>
                        </div>
                    </template>
                    <div class="table-toolbar-inner">
                        <n-checkbox-group v-model:value="checkList" @update:value="onChange">
                            <Draggable :list="columnsList" animation="300" item-key="key" filter=".no-draggable"
                                :move="onMove" @end="draggableEnd">
                                <template #item="{ element }">
                                    <div class="table-toolbar-inner-checkbox">
                                        <span class="drag-icon">
                                            <n-icon size="18">
                                                <Move />
                                            </n-icon>
                                        </span>
                                        <n-checkbox :value="element.key" :label="element.title" />
                                    </div>
                                </template>
                            </Draggable>
                        </n-checkbox-group>
                    </div>
                </n-popover>
            </div>
        </template>
        <span>列设置</span>
    </n-tooltip>
</template>
<script setup>
import Draggable from 'vuedraggable';
import { onMounted, ref } from "vue";
const emit = defineEmits(['update:list'])
const props = defineProps({
    list: {
        type: Array,
        default: []
    }
})

const checkAll = ref(true);
const checkList = ref([]);
const columnsList = ref([]);
const columnsData = ref([]);

onMounted(() => {
    init();
});
//初始化
function init() {
    columnsList.value = props.list.filter((item) => !item.type);
    checkList.value = getColumnsKey();
    columnsData.value = [...props.list];
}
//重置
const resetColumns = () => {
    columnsList.value = columnsData.value.filter((item) => !item.type);
    checkList.value = getColumnsKey();
    emit('update:list', columnsData.value);
}
// 获取列keys
const getColumnsKey = () => columnsList.value.map(v => v.key);

//全选
const onCheckAll = (e) => {
    checkList.value = e ? getColumnsKey() : [];
    updateList();
}
// 显示/隐藏
const onChange = (e) => {
    checkAll.value = e.length > 0;
    updateList();
}
// 开始拖拽
const onMove = (e) => {
    return e.draggedContext.element.draggable !== false;
}
// 拖拽结束
const draggableEnd = () => { updateList() }
// 更新列
const updateList = () => {
    const data = columnsList.value.filter(item => checkList.value.includes(item.key));
    const liuty = columnsData.value.filter((item) => item.type);
    const list = checkList.value.length ? [...liuty,...data] : [];
    emit('update:list', list)
}
</script>
<style lang="scss" scoped>
.table-toolbar {
    &-inner-popover-title {
        padding: 3px 0;
    }

    &-right {
        &-icon {
            margin-left: 12px;
            font-size: 16px;
            color: var(--text-color);
            cursor: pointer;

            :hover {
                color: #1890ff;
            }
        }
    }
}

.table-toolbar-inner {
    &-checkbox {
        display: flex;
        align-items: center;
        padding: 10px 14px;

        &:hover {
            background: #e6f7ff;
        }

        .drag-icon {
            display: inline-flex;
            margin-right: 8px;
            cursor: move;

            &-hidden {
                visibility: hidden;
                cursor: default;
            }
        }

        .fixed-item {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-left: auto;
        }

        .ant-checkbox-wrapper {
            flex: 1;

            &:hover {
                color: #1890ff !important;
            }
        }
    }

    &-checkbox-dark {
        &:hover {
            background: hsla(0, 0%, 100%, 0.08);
        }
    }
}

.toolbar-popover {
    .n-popover__content {
        padding: 0;
    }
}
</style>