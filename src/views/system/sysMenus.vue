<template>
  <div class="page-contanier">
    <div ref="pageHeader" class="page-header">
      <!-- <page-search></page-search> -->
      <page-describe
        title="系统菜单"
        desc="用于创建导航栏菜单和动态路由"
      ></page-describe>
    </div>
    <div class="page-content">
      <!-- table strat -->
      <page-table
        :data="table.data"
        :columns="columns"
        :loading="table.loading"
        @on-add="addFormData"
        @on-refresh="getPageData()"
        :permission="{ action: 'menus:add' }"
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
            <n-radio-button :value="2">按钮</n-radio-button>
          </n-radio-group>
        </n-form-item>
        <template v-if="modal.form.type != 2">
          <n-form-item label="名称" path="name">
            <n-input
              v-model:value="modal.form.name"
              placeholder="输入名称:系统管理"
            />
          </n-form-item>
          <n-form-item label="图标" path="icon">
            <n-input
              v-model:value="modal.form.icon"
              placeholder="输入菜单图标:System"
            />
          </n-form-item>
          <div class="flex">
            <n-form-item label="外链" path="iframe">
              <n-radio-group v-model:value="modal.form.iframe" name="left-size">
                <n-radio-button :value="0">否</n-radio-button>
                <n-radio-button :value="1">是</n-radio-button>
              </n-radio-group>
            </n-form-item>
            <n-form-item label="隐藏" path="icon">
              <n-radio-group v-model:value="modal.form.hidden" name="left-size">
                <n-radio-button :value="0">否</n-radio-button>
                <n-radio-button :value="1">是</n-radio-button>
              </n-radio-group>
            </n-form-item>
          </div>
          <n-form-item label="路由" path="path">
            <n-input
              v-model:value="modal.form.path"
              placeholder="输入路由地址:/system"
            />
          </n-form-item>
        </template>
        <div class="flex justify-between" v-if="modal.form.type == 1">
          <n-form-item label="组件名称" path="component_name">
            <n-input
              v-model:value="modal.form.component_name"
              placeholder="输入组件名称:system"
            />
          </n-form-item>
          <n-form-item label="组件路径" path="component">
            <n-input
              v-model:value="modal.form.component"
              placeholder="输入组件路径:system/sysUser"
            />
          </n-form-item>
        </div>
        <div class="flex justify-between" v-if="modal.form.type == 2">
          <n-form-item label="按钮名称" path="name">
            <n-input
              v-model:value="modal.form.name"
              placeholder="输入按钮名称:列表"
            />
          </n-form-item>
          <n-form-item label="权限标识" path="permission">
            <n-input
              v-model:value="modal.form.permission"
              placeholder="输入权限标识:system:list"
            />
          </n-form-item>
        </div>
        <div class="flex">
          <n-form-item label="排序" path="sort">
            <n-input-number v-model:value="modal.form.sort" />
          </n-form-item>
          <n-form-item
            label="结构"
            path="layout"
            style="width: 50%"
            v-if="modal.form.type != 2"
          >
            <n-select
              :consistent-menu-width="false"
              v-model:value="modal.form.layout"
              :options="[
                { label: '默认', value: 'defautl' },
                { label: '新打开', value: 'target' },
              ]"
            />
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
  resolveDirective
} from "vue";
import { NSpace, NButton, NTag } from "naive-ui";
import { mList, mAdd, mEdit, mDelete } from "@/api/system/menus.js";
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
    type: 0,
    ifarme: 0,
    hidden: 0,
    path: "",
    component_name: "",
    component: "",
    sort: 100,
    layout: "defautl",
    pid: 0,
    permission: "",
  },
  rules: {
    name: [
      { required: true, message: "请输入名称！", trigger: ["input", "blur"] },
    ],
    path: [
      { required: true, message: "请输入路由！", trigger: ["input", "blur"] },
    ],
    component_name: [
      {
        required: true,
        message: "请输入组件名称！",
        trigger: ["input", "blur"],
      },
    ],
    permission: [
      {
        required: true,
        message: "请输入权限标识！",
        trigger: ["input", "blur"],
      },
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
    resizable: true,
    width: 180
  },
  {
    title: "组件名称",
    key: "component_name",
  },
  {
    title: "组件",
    key: "component",
  },
  {
    title: "路由",
    key: "path",
  },
  {
    title: "权限",
    key: "permission",
  },
  {
    title: "外链",
    key: "iframe",
    render(row) {
      if (row.iframe == 0) {
        return h(
          NTag,
          { type: "info" },
          {
            default: () => "当前窗口",
          }
        );
      } else {
        return h(
          NTag,
          { type: "info" },
          {
            default: () => "外链",
          }
        );
      }
    },
  },
  {
    title: "隐藏",
    key: "hidden",
    render(row) {
      if (row.hidden == 0) {
        return h(
          NTag,
          { type: "info" },
          {
            default: () => "显示",
          }
        );
      } else {
        return h(
          NTag,
          { type: "info" },
          {
            default: () => "隐藏",
          }
        );
      }
    },
  },
  {
    title: "排序",
    key: "sort",
    resizable: true,
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
              [[permission, { action: "menus:edit" }]]
            ),
            withDirectives(
              h(
                NButton,
                { size: "small", type: "error", onClick: () => deleteRow(row) },
                { default: () => "删除" }
              ),
              [[permission, { action: "menus:delete" }]]
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
    type: 0,
    iframe: 0,
    hidden: 0,
    path: "",
    component_name: "",
    component: "",
    sort: 100,
    layout: "defautl",
    pid: 0,
    permission: "",
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