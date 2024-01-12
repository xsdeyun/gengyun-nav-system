<template>
  <div class="page-contanier">
    <div ref="pageHeader" class="page-header">
      <page-search
        v-model:value="search.value"
        @on-search="getPageData()"
        @on-reset="getPageData()"
      ></page-search>
    </div>
    <div class="page-content">
      <!-- table strat -->
      <page-table
        :data="table.data"
        :columns="table.columns"
        :loading="table.loading"
        :permission="{ action: 'user:add' }"
        @on-add="addFormData"
        @on-refresh="getPageData()"
        :pagination="true"
        :pageProps="pageProps"
        @on-updatePage="UpdatePageChange"
      >
      </page-table>
      <!-- table end -->
    </div>
    <!-- model strat -->
    <page-model
      v-model:visible="modal.visible"
      :title="modal.title"
      @on-save="saveFormData"
    >
      <n-form
        ref="formRefs"
        label-placement="left"
        :label-width="80"
        :model="modal.form"
        :rules="modal.rules"
        :show-require-mark="true"
      >
        <n-form-item label="用户名" path="username">
          <n-input
            v-model:value="modal.form.username"
            placeholder="请输入用户名..."
          />
        </n-form-item>
        <n-form-item label="昵称" path="nick_name">
          <n-input
            v-model:value="modal.form.nick_name"
            placeholder="请输入昵称..."
          />
        </n-form-item>
        <n-form-item label="邮箱" path="email">
          <n-input
            v-model:value="modal.form.email"
            placeholder="请输入邮箱..."
          />
        </n-form-item>
        <n-form-item label="状态" path="state">
          <n-radio-group v-model:value="modal.form.state" name="userstate">
            <n-space>
              <n-radio :value="1"> 启用 </n-radio>
              <n-radio :value="0"> 禁用 </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="选择角色" path="roles">
          <n-select
            v-model:value="modal.form.roles"
            :options="rolesData"
            label-field="name"
            value-field="id"
          />
        </n-form-item>
        <n-form-item label="备注" path="notes">
          <n-input
            v-model:value="modal.form.notes"
            type="textarea"
            placeholder="---"
          />
        </n-form-item>
      </n-form>
    </page-model>
    <!-- model end -->
    <updatePass ref="passWord"></updatePass>
  </div>
</template>
<script setup>
import {
  reactive,
  onMounted,
  h,
  ref,
  withDirectives,
  resolveDirective,
} from "vue";
import { uAdd, uEdit, uDelete, uList, uState } from "@/api/system/user.js";
import { rList } from "@/api/system/role.js";
import { NSpace, NButton, NSwitch } from "naive-ui";
import { validateEmail } from "@/utils";
import updatePass from "@/components/updatePass/index.vue";
// search
const search = reactive({
  value: "",
});
const rolesData = ref([]);
// page
const pageProps = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});
// table data
const table = reactive({
  data: [],
  loading: false,
  columns: [
    {
      type: "selection",
      fixed: "left",
    },
    {
      title: "用户名",
      key: "username",
    },
    {
      title: "昵称",
      key: "nick_name",
    },
    {
      title: "邮箱",
      key: "email",
    },
    {
      title: "备注",
      key: "notes",
    },
    {
      title: "状态",
      key: "status",
      render(row) {
        return h(NSwitch, {
          value: row.state,
          checkedValue: 1,
          uncheckedValue: 0,
          "on-update:value": (val) => updateState(row, val),
        });
      },
    },
    {
      title: "创建日期",
      key: "create_time",
    },
    {
      title: "操作",
      key: "actions",
      width: 200,
      fixed: "right",
      render(row) {
        const permission = resolveDirective("permission");
        return h(
          NSpace,
          {},
          {
            default: () => [
              withDirectives(
                h(
                  NButton,
                  {
                    size: "small",
                    onClick: () => updatePassword(row),
                  },
                  { default: () => "密码" }
                ),
                [[permission, { action: "user:password" }]]
              ),
              withDirectives(
                h(
                  NButton,
                  { size: "small",type:"primary", onClick: () => editRow(row) },
                  { default: () => "编辑" }
                ),
                [[permission, { action: "user:edit" }]]
              ),
              withDirectives(
                h(
                  NButton,
                  {
                    size: "small",
                    type: "error",
                    onClick: () => deleteRow(row),
                  },
                  { default: () => "删除" }
                ),
                [[permission, { action: "user:delete" }]]
              ),
            ],
          }
        );
      },
    },
  ],
});
// 弹窗数据
const modal = reactive({
  title: "用户新增",
  visible: false,
  form: {
    username: "",
    nick_name: "",
    email: "",
    state: 1,
    notes: "",
    roles: 4,
  },
  rules: {
    username: [
      { required: true, message: "请输入用户名！", trigger: ["input", "blur"] },
    ],
    nickName: [
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
  },
});
// initialization
onMounted(() => {
  getPageData();
  getRolesData();
});
// get data
const getPageData = () => {
  table.loading = true;
  const params = {
    keyword: search.value,
    page: pageProps.page,
    pageSize: pageProps.pageSize,
  };
  uList(params).then((res) => {
    table.data = res.data.list.data;
    pageProps.total = res.data.list.total;
    table.loading = false;
  });
};
const getRolesData = () => {
  const params = {
    page: 1,
    pageSize: 9999,
  };
  rList(params).then((res) => {
    rolesData.value = res.data.list.data;
  });
};
// page update data
const UpdatePageChange = (a) => {
  pageProps.page = a.page;
  pageProps.pageSize = a.pageSize;
  getPageData();
};
// 密码修改
const passWord = ref(null);
const updatePassword = (row) => {
  passWord.value?.passShow(row.id);
};
// data edit
const editRow = (row) => {
  modal.title = "用户编辑";
  modal.visible = true;
  modal.form = Object.assign({}, row);
};
// delete
const deleteId = (row) => {
  uDelete({ id: row.id }).then((res) => {
    $message.success(res.message);
    getPageData();
  });
};
// data delete
const deleteRow = (row) => {
  $dialog.confirm({
    title: "删除警告",
    content: "你确定要删除此用户吗？",
    confirm() {
      deleteId(row);
    },
    cancel() {
      $message.success("取消删除！");
    },
  });
};
// updaate state
const updateState = (row, val) => {
  uState({ id: row.id, state: val }).then((res) => {
    $message.success(res.message);
    getPageData();
  });
};
// validate rules
const formValidate = (o, callback) => {
  o.value?.validate((errors) => {
    if (!errors) {
      console.log("suc");
      callback && callback();
    } else {
      console.log(errors);
    }
  });
};
// save form
const saveFormData = () => {
  const formRefs = ref(null);
  formValidate(formRefs, addEditData());
};
const addEditData = async () => {
  const res = modal.form.id ? await uEdit(modal.form) : await uAdd(modal.form);
  if (res.code === 200) (modal.visible = false), getPageData();
  $message.success(res.message);
};
// add form
const addFormData = () => {
  modal.title = "用户新增";
  modal.visible = true;
  modal.form = {
    username: "",
    nick_name: "",
    email: "",
    state: 1,
    notes: "",
    roles: 4,
  };
};
</script>