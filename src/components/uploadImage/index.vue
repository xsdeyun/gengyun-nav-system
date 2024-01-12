<template>
  <div>
    <n-upload
      :action="systemConfig.apply_upload_image"
      :data="props.data"
      @finish="handleUploadImage"
      :show-file-list="false"
    >
    <slot></slot>
    </n-upload>
  </div>
</template>
<script setup>
import { systemConfig } from "@/config/system.config";
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(['update:images']);
const handleUploadImage = (e) => {
  const resp=JSON.parse(e.event.target.response)
  emit('update:images', resp.data.image[0])
  $message.success(resp.message)
};
</script>