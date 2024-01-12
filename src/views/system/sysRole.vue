<template>
  <n-grid x-gap="12" cols="1 s:1 m:1 l:5 xl:5 2xl:5" responsive="screen">
    <n-gi :span="3">
      <div ref="pageHeader" class="page-header">
        <page-search
          v-model:value="search.value"
          @on-search="handleSearch()"
          @on-reset="resetSearch()"
        ></page-search>
      </div>
      <div class="page-content">
        <!-- table strat -->
        <page-table
          :data="table.data"
          :columns="table.columns"
          :loading="table.loading"
          :permission="{ action: 'role:add' }"
          @on-add="addFormData"
          @on-refresh="getPageData()"
          :pagination="true"
          :pageProps="pageProps"
          @on-updatePage="UpdatePageChange"
          @on-checkRow="getIdRolesData"
        >
        </page-table>
        <!-- table end -->
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
            <n-form-item label="角色名称" path="name">
              <n-input
                v-model:value="modal.form.name"
                placeholder="请输入角色名称..."
              />
            </n-form-item>
            <n-form-item label="角色级别" path="level">
              <n-input-number
                v-model:value="modal.form.level"
                placeholder="请输入角色级别..."
              />
            </n-form-item>
            <n-form-item label="备注" path="description">
              <n-input
                v-model:value="modal.form.description"
                type="textarea"
                placeholder="---"
              />
            </n-form-item>
          </n-form>
        </page-model>
        <!-- model end -->
      </div>
    </n-gi>
    <n-gi :span="2">
      <n-card :bordered="false">
        <template #default>
        <n-tabs type="line" animated>
          <n-tab-pane name="菜单权限">
            <n-tree
              ref="menuTree"
              block-line
              :data="treeObj.menus"
              key-field="id"
              label-field="name"
              checkable
              selectable
              default-expand-all
              v-model:checked-keys="treeObj.selectedKeys"
              check-on-click
              :selected-keys="treeObj.selectedKeys"
              :node-props="handleParenChildId"
              virtual-scroll
              style="max-height: calc(100vh - 250px)"
            />
          </n-tab-pane>
        </n-tabs>
      </template>
        <template #footer>
          <n-button
          class="ml-5 mt-5"
          type="primary"
          size="small"
          v-permission="{ action: 'role:save' }"
          @click="updateIdRolesData"
        >
          保存
        </n-button>
        </template>
      </n-card>
    </n-gi>
  </n-grid>
</template>
<script setup>
import { onMounted, reactive, h, ref ,  withDirectives, resolveDirective} from "vue";
import {
  rAdd,
  rEdit,
  rDelete,
  rList,
  getIdRoles,
  updateIdRoles,
} from "@/api/system/role.js";
import { mList } from "@/api/system/menus.js";
import { NSpace, NButton } from "naive-ui";
// search
const search = reactive({
  value: "",
});
const treeObj = reactive({
  id: 0,
  menus: [],
  selectedKeys: [],
});
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
      multiple: false,
    },
    {
      title: "名称",
      key: "name",
      width: 150,
    },
    {
      title: "角色级别",
      key: "level",
      maxWidth: 80,
    },
    {
      title: "描述",
      key: "description",
      width: 150,
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
              withDirectives(h(
                NButton,
                { size: "small",type:"primary", onClick: () => editRow(row) },
                { default: () => "编辑" }
              ),
                [[permission, { action: "role:edit" }]]
              ),
              withDirectives(h(
                NButton,
                { size: "small", type: "error", onClick: () => deleteRow(row) },
                { default: () => "删除" }
              ),
                [[permission, { action: "role:delete" }]]
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
  title: "角色新增",
  visible: false,
  form: {
    name: "",
    level: 3,
    description: "",
  },
  rules: {
    name: [
      {
        required: true,
        message: "请输入角色名称！",
        trigger: ["input", "blur"],
      },
    ],
  },
});
// initialization
onMounted(() => {
  getPageData();
  getMenusData();
});

const handleSearch = () => {
  pageProps.page = 1;
  getPageData();
};
const resetSearch = () => {
  pageProps.page = 1;
  search.value = "";
  getPageData();
};
// get id roles
const getIdRolesData = (id) => {
  treeObj.id = id;
  getIdRoles({ id: id }).then((res) => {
    treeObj.selectedKeys = res.data.list.map((v) => v.menu_id);
  });
};
const menuTree = ref(null);
const updateIdRolesData = () => {
  const CheckedData = menuTree?.value.getCheckedData();
  const IndeterminateData = menuTree?.value.getIndeterminateData();
  const ids = [...CheckedData.keys, ...IndeterminateData.keys];
  updateIdRoles({ role_id: treeObj.id, ids: ids }).then((res) => {
    $message.success(res.message);
    location.reload();
  });
};
// get menus
const getMenusData = () => {
  mList().then((res) => {
    treeObj.menus = res.data.list;
  });
};
// tree edit
const handleParenChildId = ({ option }) => {
  return {
    onClick() {
      if (
        treeObj.selectedKeys.indexOf(option.id) != -1 &&
        option.children.length
      ) {
        const childs = option.children.map((c) => c.id);
        treeObj.selectedKeys = [...treeObj.selectedKeys, ...childs];
      } else {
        const childs = option.children.map((c) => c.id);
        for (var i = 0; i < treeObj.selectedKeys.length; i++) {
          if (childs.includes(treeObj.selectedKeys[i])) {
            treeObj.selectedKeys.splice(i, 1);
            i--; 
          }
        }
      }
    },
  };
};
// get roles
const getPageData = () => {
  table.loading = true;
  const params = {
    keyword: search.value,
    page: pageProps.page,
    pageSize: pageProps.pageSize,
  };
  rList(params).then((res) => {
    table.data = res.data.list.data;
    pageProps.total = res.data.list.total;
    table.loading = false;
  });
};
// page update data
const UpdatePageChange = (a) => {
  pageProps.page = a.page;
  pageProps.pageSize = a.pageSize;
  getPageData();
};
// add roles
const addFormData = () => {
  modal.title = "角色新增";
  modal.visible = true;
  modal.form = {
    name: "",
    level: 3,
    description: "",
  };
};
// edit row
const editRow = (row) => {
  modal.title = "角色编辑";
  modal.visible = true;
  modal.form = Object.assign({}, row);
};
// delete
const deleteId = (row) => {
  rDelete({ id: row.id }).then((res) => {
    $message.success(res.message);
    getPageData();
  });
};
// data delete
const deleteRow = (row) => {
  $dialog.confirm({
    title: "删除警告",
    content: "你确定要删除此角色吗？",
    confirm() {
      deleteId(row);
    },
    cancel() {
      $message.success("取消删除！");
    },
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
  const res = modal.form.id ? await rEdit(modal.form) : await rAdd(modal.form);
  if (res.code === 200) (modal.visible = false), getPageData();
  $message.success(res.message);
};
</script>
<style scoped>

</style>