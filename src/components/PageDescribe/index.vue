<template>
    <n-card class="page-card-content" :bordered="false">
        <div class="page-describe-content">
            <div class="title">{{ title }}</div>
            <div class="desc">{{ desc }}</div>
        </div>
    </n-card>
</template>
<script setup>
defineProps(["title", "desc"])
</script>
<style lang="scss" scoped>
@import"./describe.scss"
</style>