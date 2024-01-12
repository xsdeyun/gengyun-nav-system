<template>
    <!-- <n-card class="page-card-content" :bordered="false" > -->
        <n-modal v-model:show="show" :style="`width: ${props.width}px`" preset="card" :title="title">
            <slot />
            <template #footer>
                <footer class="flex justify-end">
                    <slot name="footer">
                        <n-button @click="show = false" size="small">取消</n-button>
                        <n-button class="ml-5" :loading="loading" type="primary" @click="emit('onSave')" size="small">保存</n-button>
                    </slot>
                </footer>
            </template>
        </n-modal>
    <!-- </n-card> -->
</template>
<script setup>
import { computed } from "vue"
const props = defineProps({
    width: {
        type: [String, Number],
        default: 600
    },
    title: {
        type: String,
        default: '模态框'
    },
    visible: {
        type: Boolean,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['update:visible', 'onSave']);
const show = computed({
    get() {
        return props.visible
    },
    set(v) {
        emit('update:visible', v)
    },
})
</script>
<style lang="scss" scoped></style>