<template>
    <!-- model strat -->
    <div class="update-contanier">
        <page-model v-model:visible="modal.visible" :title="modal.title" @on-save="saveFormData">
            <n-form ref="passForm" label-placement="left" :label-width="80" :model="modal.form" :rules="modal.rules"
                :show-require-mark="true">
                <n-form-item label="新密码" path="password">
                    <n-input v-model:value="modal.form.password" placeholder="请输入新密码..." />
                </n-form-item>
                <n-form-item label="确认密码" path="qpassword">
                    <n-input v-model:value="modal.form.qpassword" placeholder="请输入确认密码..." />
                </n-form-item>
            </n-form>
        </page-model>
    </div>
    <!-- model end -->
</template>
<script setup>
import { reactive, ref } from "vue"
import { updatePass } from "@/api/system/user.js"
// 弹窗数据
const modal = reactive({
    title: '密码修改',
    visible: false,
    form: {
        id: 0,
        password: "",
        qpassword: ""
    },
    rules: {
        password: [{ required: true, message: "请输入新密码！", trigger: ["input", "blur"] }],
        qpassword: [{ required: true, message: "请输入确认密码！", trigger: ["input", "blur"] }]
    }
})
// update password
const passForm = ref(null);
const saveFormData = () => {
    passForm.value?.validate((errors) => {
        if (!errors) {
            console.log("suc")
            if (modal.form.password != modal.form.password) return false;
            updatePass(modal.form).then(res => {
                $message.success(res.message);
                modal.visible = false;
            })
        } else {
            console.log(errors);
        }
    });
}
const passShow = (id) => {
    modal.visible = true;
    modal.form.id = id;
}
defineExpose({
    passShow
})
</script>