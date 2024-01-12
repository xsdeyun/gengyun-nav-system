<template>
  <div class="userInfo-contanier p-3">
    <n-grid x-gap="12" cols="1 s:1 m:1 l:7 xl:7 2xl:7" responsive="screen">
      <n-grid-item :span="2">
        <n-card class="border-rd" :bordered="false" title="个人信息" hoverable>
          <n-divider style="margin-top: 0 !important" />
          <div class="avatar-content mt-5 mb-5">
            <n-space vertical align="center">
              <n-avatar round :size="100" :src="userStore.user?.avatar_path" />
              <n-upload
                :action="systemConfig.user_upload_avatar"
                :data="{ userId: userStore.user?.id }"
                :show-file-list="false"
              >
                <n-button type="primary" size="small"> 更换头像 </n-button>
              </n-upload>
            </n-space>
          </div>
          <div class="info-content">
            <div class="item flex justify-between">
              <div class="item-icon flex items-center justify-center mb-2">
                <n-icon size="20">
                  <Person />
                </n-icon>
                <span class="ml-2">登录账号</span>
              </div>
              <div class="item-text">
                {{ userStore.user?.username }}
              </div>
            </div>
            <n-divider />
            <div class="item flex justify-between">
              <div class="item-icon flex items-center justify-center mb-2">
                <n-icon size="20">
                  <PersonSharp />
                </n-icon>
                <span class="ml-2">昵称</span>
              </div>
              <div class="item-text">
                {{ userStore.user?.nick_name }}
              </div>
            </div>
            <n-divider />
            <div class="item flex justify-between">
              <div class="item-icon flex items-center justify-center mb-2">
                <n-icon size="20">
                  <Mail />
                </n-icon>
                <span class="ml-2">用户邮箱</span>
              </div>
              <div class="item-text">
                {{ userStore.user?.email }}
              </div>
            </div>
            <n-divider />
            <div class="item flex justify-between">
              <div class="item-icon flex items-center justify-center mb-2">
                <n-icon size="20">
                  <LockClosed />
                </n-icon>
                <span class="ml-2">安全设置</span>
              </div>
              <div class="item-text">
                <n-button
                  type="primary"
                  size="small"
                  text
                  @click="updatePassword"
                >
                  修改密码
                </n-button>
              </div>
            </div>
            <n-divider />
          </div>
        </n-card>
      </n-grid-item>
      <n-grid-item :span="5">
        <n-card :bordered="false" hoverable>
          <n-tabs
            type="line"
            size="large"
            :tabs-padding="20"
            pane-style="padding: 20px;"
          >
            <n-tab-pane name="用户信息">
              <n-form
                ref="userForm"
                label-placement="left"
                :label-width="80"
                :model="form"
                :rules="rules"
                :show-require-mark="true"
              >
                <n-form-item label="昵称" path="nick_name">
                  <n-input
                    v-model:value="form.nick_name"
                    placeholder="请输入昵称..."
                  />
                </n-form-item>
                <n-form-item label="邮箱" path="email">
                  <n-input
                    v-model:value="form.email"
                    placeholder="请输入邮箱..."
                  />
                </n-form-item>
                <n-form-item>
                  <n-button class="ml-10" type="primary" size="small"  @click="saveUserData">
                    保存信息
                  </n-button>
                </n-form-item>
              </n-form>
            </n-tab-pane>
          </n-tabs>
        </n-card>
      </n-grid-item>
    </n-grid>
    <updatePass ref="passWord" />
  </div>
</template>
<script setup>
import { reactive, ref, computed, watch } from "vue";
import { useUserStore } from "@/store";
import { validateEmail } from "@/utils";
import { uEdit } from "@/api/system/user.js";
import updatePass from "@/components/updatePass/index.vue";
import { systemConfig } from "../../config/system.config";
const userStore = useUserStore();

const form = reactive({
  id: userStore.user?.id,
  nick_name: userStore.user?.nick_name,
  email: userStore.user?.email,
});
const rules = {
  nick_name: [
    { required: true, message: "请输入用昵称！", trigger: ["input", "blur"] },
  ],
  email: [
    {
      required: true,
      message: "邮箱格式不正确！",
      trigger: ["input", "blur"],
      validator: (rule, value) => {
        return validateEmail(value);
      },
    },
  ],
};
// 密码修改
const passWord = ref(null);
const updatePassword = () => {
  passWord.value?.passShow(form.id);
};
// 信息保存
const userForm = ref(null);
const saveUserData = () => {
  userForm.value?.validate((errors) => {
    if (!errors) {
      console.log("suc");
      uEdit(form).then((res) => {
        $message.success(res.message);
      });
    } else {
      console.log(errors);
    }
  });
};
</script>
<style lang="scss" scoped>
.info-content {
  .n-divider {
    margin: 0 !important;
  }

  .item {
    margin-top: 8px;
  }
}
</style>