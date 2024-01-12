<template>
  <div>
    <n-grid x-gap="12" cols="1 s:1 m:1 l:6 xl:6 2xl:6" responsive="screen">
      <n-gi :span="2">
        <n-card :bordered="false">
          <n-space class="mb-5">
            <n-button
              size="small"
              v-permission="{ action: 'dictp:add' }"
              @click="handleAddDictp"
            >
              新建
            </n-button>
            <n-button
              size="small"
              v-permission="{ action: 'dictp:edit' }"
              type="primary"
              @click="editDictpRow"
            >
              编辑
            </n-button>
            <n-button
              size="small"
              v-permission="{ action: 'dictp:delete' }"
              type="error"
              @click="deleteDictpRow"
            >
              删除
            </n-button>
          </n-space>
          <n-tree
            block-line
            :data="treeObj.data"
            key-field="id"
            label-field="name"
            selectable
            @update:selected-keys="getSelectedKeys"
          />
        </n-card>
      </n-gi>
      <n-gi :span="4">
        <n-card :bordered="false">
          <!-- table strat -->
          <page-table
            :data="table.data"
            :columns="table.columns"
            :loading="table.loading"
            @on-add="addFormData"
            @on-refresh="getDictPageData"
            :pagination="true"
            :pageProps="pageProps"
            @on-updatePage="UpdatePageChange"
            :permission="{ action: 'dictv:add' }"
          >
          </page-table>
          <!-- table end -->
        </n-card>
      </n-gi>
    </n-grid>
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
        <n-form-item label="字典名称" path="name">
          <n-input
            v-model:value="modal.form.name"
            placeholder="请输入字典名称..."
          />
        </n-form-item>
        <n-form-item label="字典值" path="value">
          <n-input
            v-model:value="modal.form.value"
            placeholder="请输入字典值..."
          />
        </n-form-item>
        <n-form-item label="排序" path="sort">
          <n-input-number
            v-model:value="modal.form.sort"
            placeholder="请输入排序..."
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
</template>
<script setup>
import { dListp, dListz, dAdd, dEdit, dDelete } from "@/api/system/dict.js";
import {
  onMounted,
  h,
  ref,
  reactive,
  withDirectives,
  resolveDirective,
} from "vue";
import { NSpace, NButton } from "naive-ui";

const treeObj = reactive({
  data: [],
  option: {},
  check: 0,
});
// page
const pageProps = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});
// 弹窗数据
const modal = reactive({
  title: "添加字典",
  visible: false,
  form: {
    name: "",
    value: "",
    sort: 100,
    description: "",
  },
  rules: {
    name: [
      {
        required: true,
        message: "请输入字典名称！",
        trigger: ["input", "blur"],
      },
    ],
    value: [
      { required: true, message: "请输入字典值！", trigger: ["input", "blur"] },
    ],
  },
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
      title: "字典名称",
      key: "name",
      width: 150,
    },
    {
      title: "字典值",
      key: "value",
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
              withDirectives(
                h(
                  NButton,
                  {
                    text: true,
                    size: "small",
                    type: "primary",
                    onClick: () => editRow(row),
                  },
                  { default: () => "编辑" }
                ),
                [[permission, { action: "dictv:edit" }]]
              ),
              withDirectives(
                h(
                  NButton,
                  {
                    text: true,
                    size: "small",
                    type: "primary",
                    onClick: () => deleteRow(row),
                  },
                  { default: () => "删除" }
                ),
                [[permission, { action: "dictv:delete" }]]
              ),
            ],
          }
        );
      },
    },
  ],
});

onMounted(() => {
  getPageData();
});

const getPageData = () => {
  dListp().then((res) => {
    treeObj.data = res.data.list;
    if (res.data.list.length) getDictPageData(res.data.list[0].id);
  });
};

const getDictPageData = (id) => {
  table.loading = true;
  const params = {
    pid: id,
    page: pageProps.page,
    pageSize: pageProps.pageSize,
  };
  dListz(params).then((res) => {
    table.data = res.data.list.data;
    pageProps.total = res.data.list.total;
    table.loading = false;
  });
};
// add dict
const handleAddDictp = () => {
  modal.visible = true;
  modal.title = "添加字典";
  modal.form = {
    pid: 0,
    name: "",
    value: "",
    sort: 100,
    description: "",
  };
};
// edit dict
const editDictpRow = () => {
  modal.title = "编辑字典";
  modal.visible = true;
  modal.form = Object.assign({}, treeObj.option);
};
// delete dict
const deleteDictpRow = () => {
  if (treeObj.option.id) {
    deleteRow(treeObj.option);
  } else {
    $message.success("没有选择数据！");
  }
};
// delete
const deleteId = (row) => {
  dDelete({ id: row.id }).then((res) => {
    $message.success(res.message);
    getPageData();
  });
};
// data delete
const deleteRow = (row) => {
  $dialog.confirm({
    title: "删除警告",
    content: "你确定要删除此字典吗？",
    confirm() {
      deleteId(row);
    },
    cancel() {
      $message.success("取消删除！");
    },
  });
};
const getSelectedKeys = (keys, option) => {
  treeObj.option = option[0];
  getDictPageData(option[0].id);
};
const formRefs = ref(null);
const saveFormData = () => {
  formRefs.value?.validate(async (errors) => {
    if (!errors) {
      console.log("suc");
      const res = modal.form.id
        ? await dEdit(modal.form)
        : await dAdd(modal.form);
      if (res.code === 200) (modal.visible = false), getPageData();
      $message.success(res.message);
    } else {
      console.log(errors);
    }
  });
};
const addFormData = () => {
  if (treeObj.option.id) {
    modal.visible = true;
    modal.title = "添加字典项";
    modal.form = {
      pid: treeObj.option.id,
      name: "",
      value: "",
      sort: 100,
      description: "",
    };
  } else {
    $message.warning("选择左侧字典！");
  }
};
// 分页
const UpdatePageChange = (a) => {
  pageProps.page = a.page;
  pageProps.pageSize = a.pageSize;
  const id = treeObj.option?.id ? treeObj.option.id : treeObj.data[0].id;
  getDictPageData(id);
};
const editRow = (row) => {
  modal.title = "编辑字典项";
  modal.visible = true;
  modal.form = Object.assign({}, row);
};
</script>