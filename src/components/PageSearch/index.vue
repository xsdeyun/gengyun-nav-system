<template>
    <n-card class="page-card-content page-search-contanier" content-style="padding: 0;" :bordered="false">
        <div class="page-search-content">
            <n-form class="n-form-content" ref="formRef" inline label-placement="left" :label-width="80" :model="formVlue"
                :rules="rules">
                <n-form-item label="模糊搜索:" path="value">
                    <n-input v-model:value="formVlue.value" placeholder="输入字段..."
                        @input="emit('update:value', formVlue.value)" />
                </n-form-item>
                <slot></slot>
                <!-- 按钮组 -->
                <n-space>
                    <n-button type="info" @click="emit('onSearch')">
                        查询
                    </n-button>
                    <n-button @click="handleResetting">
                        重置
                    </n-button>
                </n-space>
                <!-- 按钮组 -->
            </n-form>
        </div>
    </n-card>
</template>
<script setup>
import { ref } from "vue"
const emit = defineEmits(['update:value', "onSearch", "onReset"])
const props = defineProps({
    value: {
        type: String,
        default: null
    }
})
const formVlue = ref({
    value: props.value
})
const rules = [];
const handleResetting = () => {
    formVlue.value.value = "";
    emit('update:value', formVlue.value.value);
    emit('onReset');
}
</script>
<style lang="scss" scoped>
@import"./search.scss"
</style>
