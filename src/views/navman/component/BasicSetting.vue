<template>
  <n-form :label-width="80" :model="formValue" :rules="rules" ref="formRef">
    <n-grid :cols="24" :x-gap="30">
      <n-form-item-gi :span="12" label="网站名称" path="name">
        <n-input  v-model:value="formValue.name" placeholder="请输入网站名称" />
      </n-form-item-gi>
      <n-form-item-gi :span="12" label="网站标题" path="title">
        <n-input
          v-model:value="formValue.title"
          placeholder="请输入网站标题"
        />
      </n-form-item-gi>
      <n-form-item-gi :span="12" label="网站描述" path="description">
        <n-input
          placeholder="请输入网站描述"
          type="textarea"
          v-model:value="formValue.description"
        />
      </n-form-item-gi>
      <n-form-item-gi :span="12" label="网站关键字" path="keywords">
        <n-input
          placeholder="请输入网站关键字"
          type="textarea"
          v-model:value="formValue.keywords"
        />
      </n-form-item-gi>
      <n-form-item-gi :span="12" label="一言" path="motto">
        <n-input
          v-model:value="formValue.motto"
          type="textarea"
          placeholder="请输入一言"
        />
      </n-form-item-gi>
      <n-form-item-gi :span="12" label="网站Footer" path="footer">
        <n-input
          v-model:value="formValue.footer"
          type="textarea"
          placeholder="请输入网站footer"
        />
      </n-form-item-gi>

      <n-form-item-gi :span="24" label="网站logo" path="logo">
        <upload-image :data="{}" @update:images="handleUploadLogo">
          <n-avatar class="cursor-pointer" :size="100" :src="formValue.logo" />
        </upload-image>
      </n-form-item-gi>
    </n-grid>
    <div>
      <n-space>
        <n-button
          type="primary"
          @click="formSubmit"
          v-permission="{ action: 'nweb:save' }"
          >更新基本信息</n-button
        >
      </n-space>
    </div>
  </n-form>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { cFind, cAdd } from "@/api/nav/config.js";

const rules = {
  name: {
    required: true,
    message: "请输入网站名称",
    trigger: "blur",
  },
};

const formRef = ref(null);

const formValue = ref({
  title: "",
  name: "",
  description: "",
  keywords: "",
  logo: "",
  motto: "",
  footer: ""
});

onMounted(() => {
  getPageData();
});

const getPageData = () => {
  cFind().then((res) => {
    formValue.value = res.data[0];
  });
};

const handleUploadLogo = (val) => {
  formValue.value.logo = val.url;
};
const formSubmit = () => {
  formRef.value.validate((errors) => {
    if (!errors) {
      // $message.success("验证成功");
      saveConfig();
    } else {
      $message.error("验证失败，请填写完整信息");
    }
  });
};

const saveConfig = () => {
  cAdd(formValue.value).then((res) => {
    $message.success(res.message);
  });
};
</script>
