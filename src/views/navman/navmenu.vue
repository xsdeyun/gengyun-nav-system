<template>
  <div class="page-contanier">
    <div ref="pageHeader" class="page-header">
      <!-- <page-search></page-search> -->
      <page-describe title="导航菜单" desc="用于创建导航栏菜单"></page-describe>
    </div>
    <div class="page-content">
      <!-- table strat -->
      <page-table
        :data="table.data"
        :columns="columns"
        :loading="table.loading"
        @on-add="addFormData"
        @on-refresh="getPageData()"
        :permission="{ action: 'nmenu:add' }"
      ></page-table>
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
        <n-form-item label="类型" path="type">
          <n-radio-group v-model:value="modal.form.type" name="left-size">
            <n-radio-button :value="0">目录</n-radio-button>
            <n-radio-button :value="1">菜单</n-radio-button>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="名称" path="name">
          <n-input v-model:value="modal.form.name" placeholder="输入名称" />
        </n-form-item>
        <n-form-item label="图标" path="icon">
          <n-input v-model:value="modal.form.icon" placeholder="输入菜单图标" />
        </n-form-item>
        <n-form-item label="描述" path="description">
          <n-input
            v-model:value="modal.form.description"
            type="textarea"
            placeholder="请输入描述"
          />
        </n-form-item>
        <div class="flex">
          <n-form-item label="显示" path="state">
            <n-radio-group v-model:value="modal.form.state" name="left-size">
              <n-radio-button :value="0">否</n-radio-button>
              <n-radio-button :value="1">是</n-radio-button>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="排序" path="sort">
            <n-input-number v-model:value="modal.form.sort" />
          </n-form-item>
        </div>
        <n-form-item label="选择级别" path="pid">
          <n-tree-select
            :virtual-scroll="false"
            :options="[{ id: 0, name: '顶级节点' }, ...table.data]"
            :default-value="modal.form.pid"
            label-field="name"
            key-field="id"
            @update:value="
              (e) => {
                modal.form.pid = e;
              }
            "
          />
        </n-form-item>
      </n-form>
    </page-model>
    <!-- model end -->
  </div>
</template>
<script setup>
import {
  reactive,
  h,
  onMounted,
  ref,
  withDirectives,
  resolveDirective,
} from "vue";
import { NSpace, NButton, NTag } from "naive-ui";
import { mList, mAdd, mEdit, mDelete } from "@/api/nav/menus.js";
onMounted(() => {
  getPageData();
});
// 表格数据
const table = reactive({
  data: [],
  loading: false,
});
// 弹窗数据
const modal = reactive({
  title: "菜单新增",
  visible: false,
  form: {
    name: "",
    icon: "",
    description: "",
    type: 0,
    state: 1,
    sort: 100,
    pid: 0,
  },
  rules: {
    name: [
      { required: true, message: "请输入名称！", trigger: ["input", "blur"] },
    ],
  },
});
// 获取页面数据
const getPageData = () => {
  table.loading = true;
  mList().then((res) => {
    table.data = res.data.list;
    table.loading = false;
  });
};
// 表格字段
const columns = [
  {
    type: "selection",
    fixed: "left",
  },
  {
    title: "名称",
    key: "name",
  },
  {
    title: "描述",
    key: "description",
  },
  {
    title: "排序",
    key: "sort",
    resizable: true,
  },
  {
    title: "添加时间",
    key: "create_time",
  },
  {
    title: "显示",
    key: "state",
    render(row) {
      if (row.state == 0) {
        return h(
          NTag,
          { type: "error" },
          {
            default: () => "否",
          }
        );
      } else {
        return h(
          NTag,
          { type: "info" },
          {
            default: () => "是",
          }
        );
      }
    },
  },
  {
    title: "操作",
    key: "actions",
    width: "150",
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
                { size: "small",type:"primary", onClick: () => editRow(row) },
                { default: () => "编辑" }
              ),
              [[permission, { action: "nmenu:edit" }]]
            ),
            withDirectives(
              h(
                NButton,
                { size: "small", type: "error", onClick: () => deleteRow(row) },
                { default: () => "删除" }
              ),
              [[permission, { action: "nmenu:delete" }]]
            ),
          ],
        }
      );
    },
  },
];
const addFormData = () => {
  modal.title = "菜单新增";
  modal.visible = true;
  modal.form = {
    name: "",
    icon: "",
    description: "",
    type: 0,
    state: 1,
    sort: 100,
    pid: 0,
  };
};
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
// 新增保存
const saveFormData = () => {
  const formRefs = ref(null);
  formValidate(formRefs, addEditData());
};
// 新增编辑
const addEditData = async () => {
  const res = modal.form.id ? await mEdit(modal.form) : await mAdd(modal.form);
  if (res.code === 200) (modal.visible = false), getPageData();
  $message.success(res.message);
};

// 编辑行
const editRow = (row) => {
  modal.title = "菜单修改";
  modal.visible = true;
  modal.form = Object.assign({}, row);
};
const deleteId = (row) => {
  mDelete({ id: row.id }).then((res) => {
    $message.success(res.message);
    getPageData();
  });
};
// 删除行
const deleteRow = (row) => {
  $dialog.confirm({
    title: "删除警告",
    content: "你确定要删除此菜单吗？",
    confirm() {
      deleteId(row);
    },
    cancel() {
      $message.success("取消删除！");
    },
  });
};
</script>